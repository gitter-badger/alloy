import { parser } from "../../parser";
import * as irtypes from "../../../intermediate/ir";
import { ir } from "../../../intermediate/ir";

import { Lexer }  from "./Lexer";
import { TOKENS } from "./TOKENS";

import { chalk } from "../../../../../vendor/npm";

/*

js-like/Parser.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate an alloy intermediate representation for JS-like languages (JS, TS, etc).

*/

// import|export
// 	*
// 		as
// 		!error
// 			name
// 				!error
// 				advance(from)
//
// 	name
// 		advance(name)
//
// 	{
// 		default
// 			as
// 				advance(,)
// 				!advance(})
// 					}
// 						advance(from)
// 		name
// 			advance(name)
// 				,
// 					advance({)
// 					!advance(})
// 						}
// 							advance(from)
// 		!error
//
										// from
										// 	<string>
										// 		;
										// 		\n


export class Parser implements parser {

	public parse(code: string): ir|Error {
		let lexer  = new Lexer(TOKENS);
		let tokens = lexer.generateTokens(code);
		let ir: ir = [];

		let prefix: string[]   = ["import", "export"];
		let inImportDeclaration: boolean = false;
		let inExportDeclaration: boolean = false;

		// Print out token debug for now.le
		console.log(tokens);

		for (let token of tokens) {
			if (token.type === "constant") {
				if (prefix.indexOf(token.value) !== -1) {

					// Guard
					if (inImportDeclaration || inExportDeclaration) {
						if (inImportDeclaration) {
							return this.error("Export declaration started before import declaration finished!");
						} else {
							return this.error("Import declaration started before import declaration finished!");
						}
					} else {
						if (token.value === "import") {
							inImportDeclaration = true;
						} else if (token.value === "export") {
							inExportDeclaration = true;
						}
					}

					ir.push(this.createDeclaration(token));

				} else {
					console.log("constant", token)
				}
			} else {
				if (inImportDeclaration) {
					if (token.type === "name") {
						console.log("name", token)

					} else if (token.type === "operator") {
						if (token.value === "*") {
							console.log("*", token)

						} else if (token.value === "{") {
							console.log("{", token)

						}
					}
				}
			}
		}

		return ir;
	}

	private advance() {}

	private createDeclaration(token): irtypes.import_declaration|irtypes.export_declaration {
		if (token.value === "import") {
			return <irtypes.import_declaration> {
					type : "import_declaration",
					module: {
						type: "uri",
						uri : undefined
					},
					declarations: {
						default: undefined
					}
			};

		} else if (token.value === "export") {
			return <irtypes.export_declaration> {
					type : "export_declaration",
					default: {
						text: undefined
					},
					properties: {}
			};
		}
	}

	private error(message): Error {
		let errorMessage: string = `Alloy Parse Error: ${message}`;
		console.error(chalk.red(errorMessage));
		return new Error(errorMessage);
	}

}
