import { token } from "./token";

/*

Lexer.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate a list of tokens.

*/

export interface lexer {
	generateTokens(code: string): token[];
}
