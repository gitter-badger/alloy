import Tokens from "../../Tokens"

/**
 * Provides declarative tokens for the lexer to analyze.
 *
 * ES6 RC3 Module System Examples:
 * Example imports
 *   import v from "mod";
 *  	import * as ns from "mod";
 *  	import {x} from "mod";
 *  	import {x as v} from "mod";
 *  	import "mod";
 *
 *  Example exports
 *  	export var v;
 *  	export default function f(){};
 *  	export default function(){};
 *  	export default 42;
 *  	export {x};
 *  	export {v as x};
 *  	export {x} from "mod";
 *  	export {v as x} from "mod";
 *  	export * from "mod";
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
const TOKENS: Tokens = {
  // TODO(icetraxx,joeloyj): Support and ignore comments.
	"constants" : [
		"export",
		"import",
		"from",
		"as",
		"default",
		"function",
		"class",
		"let",
		"var",
		"const"
	],
	"operators": [
		"(",
		")",
		":",
		".",
		"*",
		"{",
		"}",
		",",
		"[",
		"]"
	],
	"comment_delimiters": ["//"],
	"token_delimiters" : [" ", "	", ";", "\n", ","],
	"string_delimiters": [
		"`",
		"'",
		"\""
	]
};

export default TOKENS;
