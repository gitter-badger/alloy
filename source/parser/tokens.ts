/*

Tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

*/

export interface Tokens {
	ignore           : string[];
	names            : string[];
	operators        : string[];
	string_delimiters: string[];
}
