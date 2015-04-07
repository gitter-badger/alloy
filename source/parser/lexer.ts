/*

Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

import { Token } from "./Tokens"

export interface Lexer {
	generateTokens(code: string): Token[];
}
