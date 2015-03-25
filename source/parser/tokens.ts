/*

tokens.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide a list of tokens for the lexer to analyze.

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

type IToken = [
	{
		ignore_tokens: Array<string>;
	},
	{
		declarative_tokens: {
			names    : Array<string>;
			operators: Array<string>;
		}
	},
	{
		procedural_tokens: {
			strings: (char: string, next: () => string) => string;
			names  : (char: string, next: () => string) => string;
		}
	}
];

var Tokens: IToken = [

	{
		ignore_tokens: [" "]
	},

	// Todo(Chris):
	// Match EOL for automatic semicolon insertion
	{
		declarative_tokens: {

			names: [
				"import",
				"from",
				"as",
				"export",
				"default"
			],

			operators: [
				"*",
				"{",
				"}",
				",",
				";"
			]

		}
	},

	// Todo(Chris):
	// Implement procedural tokens
	{
		procedural_tokens: {

			strings: (char, next) => {
				return ""
			},

			names: (char, next) => {
				return ""
			}

		}
	}

];

module.exports = Object.freeze(Tokens)