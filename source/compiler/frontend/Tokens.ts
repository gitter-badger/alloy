/*

Tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Interface for declarative token matching.

*/

// TODO(Chris): add reserved names
interface Tokens {
	constants              : string[];
	operators              : string[];
	comment_delimiters     : string[];
	token_delimiters       : string[];
	string_delimiters      : string[];
}

export default Tokens;
