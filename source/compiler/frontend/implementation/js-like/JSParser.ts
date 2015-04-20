import { Declaration, Element, ExportElement, ImportElement, Module, ModuleType } from "../../../intermediate/ir_oop";
import { chalk } from "../../../../../vendor/npm";
import Lexer  from "./JSLexer";
import Parser from "../../Parser";
import TOKENS from "./JSTokens";
import Token from "../../Token";

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

export default class JSParser implements Parser {

	public parse(code: string): Element[] {
		let lexer  = new Lexer(TOKENS);
		let tokens = lexer.generateTokens(code);
		let result: Element[] = [];

		let prefix: string[]   = ["import", "export"];
		let inImportDeclaration: boolean = false;
		let inExportDeclaration: boolean = false;
		let lastToken: Token;

		// Print out token debug for now.le
		// console.log(tokens);

		for (let token of tokens) {
			if (token.type === "constant") {
				if (prefix.indexOf(token.value) !== -1) {

					// Guard
					if (inImportDeclaration || inExportDeclaration) {
						if (inImportDeclaration) {
							throw this.error("Export declaration started before import declaration finished!");
						} else {
							throw this.error("Import declaration started before import declaration finished!");
						}
					} else {
						if (token.value === "import") {
							inImportDeclaration = true;
						} else if (token.value === "export") {
							inExportDeclaration = true;
						}
					}

					result.push(this.createDeclaration(token));

					// Reset last token
					lastToken = undefined;
				} else {

					if (token.value === "from") {
						if (lastToken.value !== "}" && lastToken.type !== "name") {
							throw this.error(`Unexpected ${lastToken.type} '${lastToken.value}' before constant 'from'!`);
						}
						lastToken = token;
					}
				}
			} else {
				if (inImportDeclaration) {
					console.log("IN IMPORT")
					let lastIREntry = <ImportElement> result[result.length - 1];

					if (token.type === "string") {
						if (lastToken.value !== "from") {
							throw this.error(`Unexpected string ${token.value} after ${lastToken.type} '${lastToken.value}'`);
						}

						lastIREntry.module.spec = token.value;

						console.log(lastIREntry)
						inImportDeclaration = false;

					} else if (token.type === "name") {
						console.log("IN NAME")

						if (lastToken && lastToken.type !== "delimiter" && lastToken.value !== "{" && lastToken.value !== ",") {
							throw this.error(`Unexpected ${lastToken.type} '${lastToken.value}' before name '${token.value}'!`);
						}

						lastIREntry.declarations.push(new Declaration(token.value, token.value));

						console.log(lastIREntry.declarations)

					} else if (token.type === "operator") {
						console.log("IN OPERATOR", token.value)
						if (token.value === "}") {
							if (!lastToken || lastToken.type !== "name") {
								throw this.error(`Unexpected }, expected type 'name'!`);
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

		return result;
	}

	private advance() {}

	private createDeclaration(token): Element {
		if (token.value === "import") {
			let mod = new Module(undefined, ModuleType.URI);
			return new ImportElement(mod, []);

		} else if (token.value === "export") {
			return new ExportElement([], "");
		}
	}

	private error(message): Error {
		let errorMessage: string = `Alloy Parse Error: ${message}`;
		console.error(chalk.red(errorMessage));
		return new Error(errorMessage);
	}

}
