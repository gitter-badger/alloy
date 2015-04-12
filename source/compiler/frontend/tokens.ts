/*

Tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Interface for declarative token matching.

*/

export interface tokens {
	constant         : string[];
	operators        : string[];
	token_delimiters : string[];
	string_delimiters: string[];
}
