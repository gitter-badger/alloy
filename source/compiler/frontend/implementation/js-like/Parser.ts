import { parser } from "../../parser";
import { ast }    from "../../../intermediate/ast";

import { Lexer }  from "./Lexer";
import { TOKENS } from "./TOKENS";

/*

js-line/Parser.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate an alloy ast for JS-like languages (JS, TS, etc).

*/

export class Parser implements parser {

	parse(code: string): ast {
		let lexer  = new Lexer(TOKENS);
		let tokens = lexer.generateTokens(code);

		console.log(tokens);


		return <ast>{};

	}

}
