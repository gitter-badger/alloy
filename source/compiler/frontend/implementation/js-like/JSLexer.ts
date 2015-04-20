import isValidNameRegex from "./match_es6_name";
import lexer from "../../lexer";
import token from "../../token";
import tokens from "../../tokens";

/*

js-like/Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export default class JSLexer implements lexer {

	// Inject tokens on creation
	constructor(private tokens: tokens) {}

	// Public
	public generateTokens(code: string):token[] {
		let partialToken : string  = "";
		let inUnknown    : boolean = false;
		let inName       : boolean = false;
		let inString     : boolean = false;
		let outputTokens : token[] = [];

		for (let character of code) {
			partialToken += character;

			if (this.isStringDelimiter(character)) {

				// Set inString if this is the first string delimiter.
				if (!inString) {
					inString = true;

				// If we are in a string, create the string token and unset inString
				} else {
					let useToken = partialToken.slice(1, partialToken.length - 1);
					outputTokens.push(this.createToken("string", useToken));
					inString = false;
					partialToken = "";
				}

			} else if (!inString) {

				if (inName && !this.isName(partialToken) || this.isMatchToken(partialToken)) {

					// inName has ended
					inName = false;

					// Make sure it doesn't match a token and we are on a delimiter.
					if (!this.isMatchToken(partialToken) && (this.isTokenDelimiter(character) || this.isMatchToken(character))) {

						// Then the name ended.
						let useToken = partialToken.slice(0, partialToken.length - 1);
						outputTokens.push(this.createToken("name", useToken));
						partialToken = partialToken.slice(partialToken.length - 1, partialToken.length);
					}
				}

				if (this.isTokenDelimiter(character)) {

					// If we are in a unknown, create the unknown token and unset inUnknown
					// as long as the partial token is longer than the delimiter.
					if (inUnknown && partialToken.length > 1) {

						// Slice off the delimiter
						let useToken = partialToken.slice(0, partialToken.length - 1);
						outputTokens.push(this.createToken("unknown", useToken));
						inUnknown = false;
						inName    = false;
					} else {
						outputTokens.push(this.createToken("delimiter", partialToken));
					}

					// Ignore token delimiters
					partialToken = "";

				} else if (this.isComment(partialToken)) {
					outputTokens.push(this.createToken("comment", partialToken));
					partialToken = "";

				} else if (this.isMatchToken(partialToken)) {

					// Output all declarative tokens
					let tokenType = this.matchTokenType(partialToken);
					outputTokens.push(this.createToken(tokenType, partialToken));
					partialToken = "";

				} else if (this.isName(partialToken)) {
					inName = true;

				} else {

					// Assume the beginning of an unknown.
					inUnknown = true;
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
			return ["constant", "operator"][matchedIndex];
		}

		throw new Error(`No matched token type: ${partialToken}`);
	}

	private tokenTypes(tokens: tokens): string[][] {
		return [tokens.constants, tokens.operators];
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

	private isComment(partialToken: string): boolean {
		for (let delimiter of this.tokens.comment_delimiters) {
			if (partialToken === delimiter) {
				return true;
			}
		}
		return false;
	}

	private isName(partialToken: string): boolean {
		return isValidNameRegex.test(partialToken);
	}

	private createToken(tokenType: string, tokenValue: string):token {
		return {
			"type" : tokenType,
			"value": tokenValue
		};
	}

}
