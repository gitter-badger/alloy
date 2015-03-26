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
	generateTokens(tokens: string): Array<string>
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
	public generateTokens(string: string) {
		let currentToken: string        = ""
		let allTokens   : Array<string> = []

		for (let character of string) {
			currentToken += character
			let string = this.checkStringForToken(currentToken)


			console.log(character)
		}

		return []

	}

	// Helpers
	private checkStringForToken(string: string): string {
		return ""
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
