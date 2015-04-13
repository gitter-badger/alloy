import { parser } from "../../parser";
import * as irtypes from "../../../intermediate/ir";
import { ir } from "../../../intermediate/ir";

import { Lexer }  from "./Lexer";
import { TOKENS } from "./TOKENS";
import { token } from "../../token";

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
		let lastToken: token;

		// Print out token debug for now.le
		// console.log(tokens);

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

					// Reset last token
					lastToken = undefined;
				} else {

					if (token.value === "from") {
						if (lastToken.value !== "}" && lastToken.type !== "name") {
							return this.error(`Unexpected ${lastToken.type} '${lastToken.value}' before constant 'from'!`);
						}
						lastToken = token;
					}
				}
			} else {
				if (inImportDeclaration) {
					console.log("IN IMPORT")
					let lastIREntry = <irtypes.import_declaration> ir[ir.length - 1];

					if (token.type === "string") {
						if (lastToken.value !== "from") {
							return this.error(`Unexpected string ${token.value} after ${lastToken.type} '${lastToken.value}'`);
						}

						lastIREntry.module["uri"] = token.value;

						console.log(lastIREntry)
						inImportDeclaration = false;

					} else if (token.type === "name") {
						console.log("IN NAME")

						if (lastToken && lastToken.type !== "delimiter" && lastToken.value !== "{" && lastToken.value !== ",") {
							return this.error(`Unexpected ${lastToken.type} '${lastToken.value}' before name '${token.value}'!`);
						}

						lastIREntry.declarations[token.value] = {
							property: token.value
						};

						console.log(lastIREntry.declarations)

					} else if (token.type === "operator") {
						console.log("IN OPERATOR", token.value)
						if (token.value === "}") {
							if (!lastToken || lastToken.type !== "name") {
								return this.error(`Unexpected }, expected type 'name'!`);
							}
						}
					}
				} else {
					console.log("OUT OF IMPORT")
				}

				// Ignore delimiters
				if (token.type !== "delimiter") {
					lastToken = token;
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
					declarations: {}
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
