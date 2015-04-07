import { Tokens } from "./Tokens";
import { Lexer } from "./Lexer";

/*

JSLexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

/*

Interfaces

*/

interface Token {
	[index: string]: string
}

/*

Implementation

*/

export class JSLexer implements Lexer {

	// Properties
	private prefixOperators : string = "<>+-&";
	private postfixOperators: string = "=>&:";

	// Inject tokens on creation
	constructor(private tokens: Tokens) {}

	// Public
	public generateTokens(inputString: string) {
		let partialToken: string   = "";
		let inName: boolean        = false;
		let inString: boolean      = false;
		let outputTokens: string[] = [];

		for (let character of inputString) {
			partialToken += character;

			if (!inString && this.isTokenDelimiter(character)) {

				if (partialToken.length > 1) {
					outputTokens.push(partialToken)
				}

				// Reset partial token and continue
				partialToken = "";
				continue

			} else if (!inString && this.useToken(partialToken)) {
				outputTokens.push(partialToken);
				partialToken = "";
				continue

			} else if (!inString && this.isNumber(partialToken)) {

				// Don't support numbers
				throw new Error(`Unexpected token [number]: ${partialToken};`);

			} else if (this.isStringDelimiter(character)) {

				if (!inString) {
					inString = true;

				} else {
					outputTokens.push(partialToken);
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
		for (let tokens of [this.tokens.names, this.tokens.operators]) {
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

	private createToken(tokenString: string): Token {
		return {
			"type" : "",
			"value": tokenString,
			"from" : "",
			"to"   : ""
		}
	}

}
