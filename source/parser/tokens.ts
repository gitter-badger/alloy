/*

tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide declarative tokens for the lexer to analyze.

ES6 RC3 Module System Examples:

	Example imports
		import v from "mod";
		import * as ns from "mod";
		import {x} from "mod";
		import {x as v} from "mod";
		import "mod";

	Example exports
		export var v;
		export default function f(){};
		export default function(){};
		export default 42;
		export {x};
		export {v as x};
		export {x} from "mod";
		export {v as x} from "mod";
		export * from "mod";

*/

export interface TokensInterface {
	[index: string]: Array<string>
}

let DefaultTokens: TokensInterface = {
	"ignore": [" "],
	"names" : [
		"export",
		"import",
		"from",
		"as",
		"default",
	],
	"operators": [
		"*",
		"{",
		"}",
		",",
		";"
	],
	"string_delimiters": [
		"`",
		"'",
		"\""
	]
}

module.exports = Object.freeze(DefaultTokens)
