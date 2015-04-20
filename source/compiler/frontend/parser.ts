import { ir } from "../intermediate/ir";

/*

parser.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate an ir from a list of tokens.

*/

interface parser {
	parse(code: string): ir|Error;
}

export default parser;
