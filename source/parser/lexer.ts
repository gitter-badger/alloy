/*

Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export interface Lexer {
	generateTokens(code: string): string[];
}
