import { MatchTokens, Token } from "./Tokens";
import { Lexer } from "./Lexer";

/*

JSLexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export class JSLexer implements Lexer {

	// Inject tokens on creation
	constructor(private tokens: MatchTokens) {}

	// Public
	public generateTokens(code: string):Token[] {
		let partialToken: string   = "";
		let inName      : boolean  = false;
		let inString    : boolean  = false;
		let outputTokens: Token[]  = [];

		for (let character of code) {
			partialToken += character;

			if (this.isStringDelimiter(character)) {

				// Set inString if this is the first string delimiter.
				if (!inString) {
					inString = true;

				// If we are in a string, create the string token and unset inString
				} else {
					outputTokens.push(this.createToken("string", partialToken));
					inString = false;
					partialToken = "";
				}

			} else if (!inString) {

				if (this.isTokenDelimiter(character)) {

					// If we are in a name, create the name token and unset inName
					// as long as the partial token is longer than the delimiter.
					if (inName && partialToken.length > 1) {
						outputTokens.push(this.createToken("name", partialToken));
						inName = false;
					}

					// Ignore token delimiters
					partialToken = "";
					continue

				} else if (this.useToken(partialToken)) {

					// Output all declarative tokens
					outputTokens.push(this.createToken("name", partialToken));
					partialToken = "";
					continue

				} else if (this.isNumber(partialToken)) {

					// Don't support numbers, throw an error
					throw new Error(`Unexpected token [number]: ${partialToken};`);

				} else {

					// Assume the beginning of a name.
					inName = true;
				}
			}
		}

		return outputTokens;
	}

	// Token Generation

	// Helpers
	private useToken(partialToken: string): boolean {
		let tokenTypes:any[] = [this.tokens.names, this.tokens.operators];
		let tokenTypeIndex:number = 0;

		for (let tokens of tokenTypes) {
			tokenTypeIndex += 1;
			for (let matchToken of tokens) {
				if (partialToken === matchToken) {
					return true
				}
			}
		}
		return false
	}

	private isTokenDelimiter(partialToken: string) {
		for (let ignoredToken of this.tokens.token_delimiters) {
			if (partialToken === ignoredToken) {
				return true
			}
		}
		return false
	}

	private isStringDelimiter(partialToken: string): boolean {
		for (let delimiter of this.tokens.string_delimiters) {
			if (partialToken === delimiter) {
				return true
			}
		}
		return false

	}

	private isNumber(partialToken: string): boolean {
		return !!parseInt(partialToken, 10)
	}

	private createToken(type: string, value: string):Token {
		return {
			"type" : type,
			"value": value
		};
	}

}
