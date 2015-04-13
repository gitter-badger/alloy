import { token }  from "../../token";
import { tokens } from "../../tokens";
import { lexer }  from "../../lexer";

import { default as isValidNameRegex } from "./match_es6_name";

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
					outputTokens.push(this.createToken("string", partialToken));
					inString = false;
					partialToken = "";
				}

			} else if (!inString) {

				if (this.isTokenDelimiter(character)) {

					// If we are in a unknown, create the unknown token and unset inUnknown
					// as long as the partial token is longer than the delimiter.
					if ((inUnknown || inName) && partialToken.length > 1) {

						// Slice off the delimiter
						let useToken = partialToken.slice(0, partialToken.length - 1)
						let tokenType =  inName && !inUnknown ? "name" : "unknown";
						outputTokens.push(this.createToken(tokenType, useToken));
						inUnknown = false;
						inName    = false;
					}

					// Ignore token delimiters
					partialToken = "";

				} else if (this.isMatchToken(partialToken)) {

					// Output all declarative tokens
					let tokenType = this.matchTokenType(partialToken);
					outputTokens.push(this.createToken(tokenType, partialToken));
					partialToken = "";

				} else if (this.isName(partialToken)) {
					inName = true

				} else if (this.isNumber(partialToken)) {

					// Don't support numbers, continue
					// TODO(Chris): Implement proper number support to detect errors.
					continue;

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

	private isName(partialToken: string): boolean {
		return isValidNameRegex.test(partialToken);
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
