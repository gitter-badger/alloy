import token from "./token";

/*

Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate a list of tokens.

*/

interface lexer {
	generateTokens(code: string): token[];
}

export default lexer;
