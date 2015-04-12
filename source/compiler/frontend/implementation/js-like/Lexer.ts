import { token } from "../../token";
import { tokens } from "../../tokens";
import { lexer } from "../../lexer";

/*

js-line/Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export class Lexer implements lexer {

	// Inject tokens on creation
	constructor(private tokens: tokens) {}

	// Public
	public generateTokens(code: string):token[] {
		let partialToken: string   = "";
		let inName      : boolean  = false;
		let inString    : boolean  = false;
		let outputTokens: token[]  = [];

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

				} else if (this.isMatchToken(partialToken)) {

					// Output all declarative tokens
					let tokenType = this.matchTokenType(partialToken);
					outputTokens.push(this.createToken(tokenType, partialToken));
					partialToken = "";

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

	// Helpers
	private matchTokenType(partialToken: string): string {
		let tokenTypes = this.tokenTypes(this.tokens);
		let matchedIndex:number;

		for (let index in tokenTypes) {
			for (let matchToken of tokenTypes[index]) {
				if (partialToken === matchToken) {
					matchedIndex = index;
					break;
				}
			}
		}

		if (matchedIndex) {
			return ["name", "operator"][matchedIndex];
		}

		throw new Error(`No matched token type: ${partialToken}`);
	}

	private tokenTypes(tokens: tokens): string[][] {
		return [tokens.names, tokens.operators];
	}

	private isMatchToken(partialToken: string): boolean {
		let tokenTypes = this.tokenTypes(this.tokens);

		for (let tokens of tokenTypes) {
			for (let matchToken of tokens) {
				if (partialToken === matchToken) {
					return true;
				}
			}
		}
		return false;
	}

	private isTokenDelimiter(partialToken: string): boolean {
		for (let ignoredToken of this.tokens.token_delimiters) {
			if (partialToken === ignoredToken) {
				return true;
			}
		}
		return false
	}

	private isStringDelimiter(partialToken: string): boolean {
		for (let delimiter of this.tokens.string_delimiters) {
			if (partialToken === delimiter) {
				return true;
			}
		}
		return false;

	}

	private isNumber(partialToken: string): boolean {
		return !!parseInt(partialToken, 10);
	}

	private createToken(tokenType: string, tokenValue: string):token {
		return {
			"type" : tokenType,
			"value": tokenValue
		};
	}

}
