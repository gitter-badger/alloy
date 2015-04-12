import { ast } from "../intermediate/ast";

/*

parser.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate an ast from a list of tokens.

*/

export interface parser {
	parse(code: string): ast;
}
