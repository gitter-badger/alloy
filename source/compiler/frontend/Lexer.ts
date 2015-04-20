import Token from "./Token";

/*

Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate a list of tokens.

*/

interface Lexer {
	generateTokens(code: string): Token[];
}

export default Lexer;
