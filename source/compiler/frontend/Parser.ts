import { Element } from "../intermediate/ir";

/*

parser.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate an ir from a list of tokens.

*/

interface Parser {
	parse(code: string): Element[];
}

export default Parser;
