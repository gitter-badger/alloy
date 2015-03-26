import { TokensInterface } from "./tokens"

/*

lexer.ts

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

export interface LexerInterface {
	generateTokens(tokens: string): string[]
}

/*

Implementation

*/

export class Lexer implements LexerInterface {

	// Properties

	private prefixOperators : string = "<>+-&"
	private postfixOperators: string = "=>&:"

	// Inject tokens on creation

	constructor(private tokens: TokensInterface) {}

	// Public

	public generateTokens(inputString: string) {
		let partialToken: string   = ""
		let outputTokens: string[] = []

		for (let character of inputString) {
			partialToken += character

			if (this.ignoreToken(partialToken)) {

				// Reset token and continue
				console.log(`ignored: ${partialToken}`)
				partialToken = ""
				continue
			}

			if (this.useToken(partialToken)) {

				// Moo
				console.log(`matched: ${partialToken}`)
				partialToken = ""
				continue
			}

		}

		return []

	}

	// Helpers

	private ignoreToken(partialToken: string) {
		for (let ignoredToken of this.tokens.ignore) {
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

	private createToken(string: string): Token {
		return {
			"type" : "",
			"value": "",
			"from" : "",
			"to"   : ""
		}
	}

}
