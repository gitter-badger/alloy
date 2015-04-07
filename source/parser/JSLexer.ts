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
		let inName: boolean        = false;
		let inString: boolean      = false;
		let outputTokens: Token[]  = [];

		for (let character of code) {
			partialToken += character;

			if (!inString && this.isTokenDelimiter(character)) {

				if (inName && partialToken.length > 1) {
					outputTokens.push(this.createToken("name", partialToken));
					inName = false;
				}

				// Reset partial token and continue
				partialToken = "";
				continue

			} else if (!inString && this.useToken(partialToken)) {
				outputTokens.push(this.createToken("name", partialToken));
				partialToken = "";
				continue

			} else if (!inString && this.isNumber(partialToken)) {

				// Don't support numbers
				throw new Error(`Unexpected token [number]: ${partialToken};`);

			} else if (this.isStringDelimiter(character)) {

				if (!inString) {
					inString = true;

				} else {
					outputTokens.push(this.createToken("string", partialToken));
					inString = false;
					partialToken = "";
				}
				continue

			} else if (!inString) {

				// Assume name
				inName = true;
			}

		}

		return outputTokens;

	}

	// Helpers
	private isTokenDelimiter(partialToken: string) {
		for (let ignoredToken of this.tokens.token_delimiters) {
			if (partialToken === ignoredToken) {
				return true
			}
		}
		return false
	}

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
