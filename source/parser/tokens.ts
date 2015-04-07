/*

Tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Interfaces for token matching.

*/

export interface MatchTokens {
	names            : string[];
	operators        : string[];
	token_delimiters : string[];
	string_delimiters: string[];
}

export interface Token {
	type: string;
	value: string;
}
