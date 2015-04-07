/*

Tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export interface Tokens {
	names            : string[];
	operators        : string[];
	token_delimiters : string[];
	string_delimiters: string[];
}
