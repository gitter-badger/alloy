/*

lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

import { tokens } from "./tokens"


interface Token {
	[index: string]: string
}

export interface LexerInterface {
	generateTokens(tokens: string): Array<string>
}

export class Lexer implements LexerInterface {

	constructor() {}

	private prefixOperators : string = "<>+-&"
	private postfixOperators: string = "=>&:"
	private createToken (string: string): Token {
		return {
			"type": "",
			"value": "",
			"from": "",
			"to": ""
		}
	}

	generateTokens(string: string) {
		let currentToken: string        = ""
		let allTokens   : Array<string> = []
		console.log(tokens)

		for (let character of string) {
			console.log(character)
		}

		return []

	}

}
