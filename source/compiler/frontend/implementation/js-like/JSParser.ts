import { Declaration, Element, ExportElement, ImportElement, Module, ModuleType } from "../../../intermediate/ir_oop";
import { arrify, chalk, ramda as R } from "../../../../../vendor/npm";
import Lexer  from "./JSLexer";
import Parser from "../../Parser";
import TOKENS from "./JSTokens";
import Token from "../../Token";

const OPENING_TO_CLOSING_PUNCTUATOR_MAP = { "{": "}", "(": ")", "[": "]"};
const DEFAULT_VAR = "__alloy_default";
const WHITESPACE = /\s/;

/**
 * Generates an alloy intermediate representation for JS-like languages
 * (JS, TS, etc). Terminology used is based on ES6 specifications.
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
export default class JSParser implements Parser {

	private tokens: TokenIterator;
	private hasDefaultExport: boolean;

	public parse(code: string): Element[] {
		let result: Element[] = [];

		let lexer  = new Lexer(TOKENS);
		this.tokens = new TokenIterator(lexer.generateTokens(code));
		this.hasDefaultExport = false;

		while (this.tokens.hasNext()) {
			let next = this.tokens.peek().value;
			// TODO(joeloyj): Check that import and export are scoped to module.
			if (next === "import") {
				result.push(this.parseImportDeclaration());
			} else if (next === "export") {
				result.push(this.parseExportDeclaration());
			} else {
				// TODO(icetraxx,joeloyj): Handle unparsed elements.
				this.tokens.pop();
			}
		}

		return result;
	}

	// Parses an ES6 compatible export declaration.
	private parseExportDeclaration(): ExportElement {
		let exportKeyword = this.tokens.pop().value;
		if (exportKeyword !== "export") {
			throw this.error(`Unexpected '${exportKeyword}', expected 'export'.`);
		}

		let next = this.tokens.peek().value;
		if (next === "default") {
			if (this.hasDefaultExport) {
				throw this.error("'default' modifier can only be used once per module.");
			}
			this.hasDefaultExport = true;
			this.tokens.pop();
			return new ExportElement(arrify(new Declaration("default", DEFAULT_VAR)));
		} else if (next === "*") {
			this.tokens.pop();
			let result = new ExportElement(undefined, this.parseFromClause());
			this.maybeConsume(";");
			return result;
		} else if (next === "{") {
			let declarations = this.parseNamedImportsOrExports();
			let mod;
			if (this.tokens.peek().value === "from") {
				mod = this.parseFromClause();
			}
			this.maybeConsume(";");
			return new ExportElement(declarations, mod);
		} else {
			// TODO(joeloyj): Return text!
			return new ExportElement(this.parseNamedDeclaration());
		}
	}

	// Parses an ES6 compatible import declaration.
	private parseImportDeclaration(): ImportElement {
		let importKeyword = this.tokens.pop().value;
		if (importKeyword !== "import") {
			throw this.error(`Unexpected '${importKeyword}', expected 'import'.`);
		}

		if (this.tokens.peek().type === "string") {
			let mod = this.parseModuleSpecifier();
			this.maybeConsume(";");
			return new ImportElement(mod, []);
		} else {
			let declarations = this.parseImportClause();
			let mod = this.parseFromClause();
			this.maybeConsume(";");
			return new ImportElement(mod, declarations);
		}
	}

	// Parses an import clause, which could be an imported default bindings
	// and/or, a namespace import or list of named imports.
	private parseImportClause(): Declaration[] {
		let declarations: Declaration[] = [];
		let next = this.tokens.peek();
		if (next.value !== "*" && next.value !== "{") {
			declarations.push(this.parseImportedDefaultBinding());
			if (!this.maybeConsume(",")) {
				return declarations;
			}
		}
		next = this.tokens.peek();
		if (next.value === "*") {
			declarations.push(this.parseNamespaceImport());
		} else if (next.value === "{") {
			declarations = declarations.concat(this.parseNamedImportsOrExports());
		} else {
			throw this.error(`Unexpected '${next.value}' in import clause.`);
		}
		return declarations;
	}

	// Parses an identifier for an imported default binding.
	private parseImportedDefaultBinding(): Declaration {
		let identifier = this.parseName("identifier for imported default binding");
		return new Declaration(identifier, "default");
	}

	// Parses a namespace import, e.g. * as foo
	private parseNamespaceImport(): Declaration {
		this.consume("*");
		this.consume("as");
		return new Declaration(this.parseBinding());
	}

	// Parses a list of named imports or exports, e.g. { x as y, z }
	private parseNamedImportsOrExports(): Declaration[] {
		this.consume("{");
		if (this.maybeConsume("}")) {
			return [];
		}

		let declarations: Declaration[] = [];
		do {
			declarations.push(this.parseSpecifier());
		} while (this.maybeConsume(",") && this.tokens.peek().value !== "}");

		this.consume("}");
		return declarations;
	}

	// Parses an identifier for an imported or exported binding.
	private parseBinding(): string {
		return this.parseName("identifier for binding");
	}

	// Parses an import or export specifier, e.g. x as y
	private parseSpecifier(): Declaration {
		let binding = this.parseBinding();
		if (this.maybeConsume("as")) {
			return new Declaration(this.parseBinding(), binding);
		} else {
			return new Declaration(binding, binding);
		}
	}

	// Parses from clause, e.g. from "foo".
	private parseFromClause(): Module {
		let fromKeyword = this.tokens.pop().value;
		if (fromKeyword !== "from") {
			throw this.error(`Unexpected '${fromKeyword}', expected 'from'.`);
		}
		return this.parseModuleSpecifier();
	}

	// Parses module specifier, which must be a string literal.
	private parseModuleSpecifier(): Module {
		return new Module(this.parseStringLiteral(), ModuleType.URI);
	}

	// Parses a named declaration, which could be one of the following:
	// - var declaration, e.g. var x = 123, y = "foo";
	// - let declaration, e.g. let x = 123, y = "foo";
	// - const declaration, e.g. const X = 123, Y = "foo";
	// - function declaration, e.g. function foo() { ... }
	// - generator declaration, e.g. function* foo() { ... }
	// - class declaration, e.g. class Foo { ... }
	private parseNamedDeclaration(): Declaration[] {
		let next = this.tokens.pop().value;
		if (R.contains(next, ["var", "let", "const"])) {
			return this.parseDeclarationList();
		} else if (next === "class") {
			let className = this.parseName("class identifier");
			return arrify(new Declaration(className, className));
		} else if (next === "function") {
			let nameType = this.maybeConsume("*")
					? "generator identifier"
					: "function identifier";
			let name = this.parseName(nameType);
			return arrify(new Declaration(name, name));
		} else {
			throw this.error(`Unexpected '${next}', expected named declaration.`);
		}
	}

	// Parses a list of declarations, e.g. x = "foo", y = 123
	private parseDeclarationList(): Declaration[] {
		let declarations: Declaration[] = [];
		do {
			let identifier = this.tokens.pop();
			if (identifier.type !== "name") {
				throw this.error(
						`Unexpected '${identifier.value}', expected identifier.`);
			}
			declarations.push(new Declaration(identifier.value, identifier.value));

			// Advance to next declaration, or end of declaration list.
			let next: Token;
			while ((next = this.tokens.peekSafe(false /* don't skip whitespace */))
							!= undefined
					&& !R.contains(next.value, [",", ";", "\n"])) {
				if (R.has(next.value, OPENING_TO_CLOSING_PUNCTUATOR_MAP)) {
					this.tokens.skipBlock();
				} else {
					this.tokens.pop(false /* don't skip whitespace */);
				}
			}
		} while (this.maybeConsume(","));
		this.maybeConsume(";");
		return declarations;
	}

	// Parses a string literal, i.e. "foo", 'foo', or `foo`.
	private parseStringLiteral(): string {
		let str = this.tokens.pop();
		if (str.type !== "string") {
			throw this.error(`Unexpected '${str.value}', expected string literal.`);
		}
		return str.value;
	}

	// Parses a name.
	private parseName(nameType: string): string {
		let name = this.tokens.pop();
		if (name.type !== "name") {
			throw this.error(`Unexpected '${name.value}', expected ${nameType}.`);
		}
		return name.value;
	}

	// Consumes the next token and throws an error if it is not as expected.
	private consume(expected: string): void {
		let next = this.tokens.pop().value;
		if (next !== expected) {
			throw this.error(`Unexpected '${next}', expected '${expected}'.`);
		}
	}

	// Consumes the next token if it is the given expected token.
	// Otherwise return false.
	private maybeConsume(expected: string): boolean {
		if (this.tokens.hasNext() && this.tokens.peek().value === expected) {
			this.tokens.pop();
			return true;
		}
		return false;
	}

	// Returns an Alloy parse error with the given message.
	private error(message): Error {
		let errorMessage: string = `Alloy Parse Error: ${message}`;
		console.error(chalk.red(errorMessage));
		return new Error(errorMessage);
	}
}

// TODO(joeloyj): Generalize this class and move to it's own file.
/**
 * Token iterator providing various convenience functions.
 *
 * @author Joel Ong (joelo@google.com)
 */
class TokenIterator {
	constructor(private tokens: Token[]) {}

	/**
	 * Returns true if there are more tokens. Skips whitespace by default.
	 */
	hasNext(skipWhitespace: boolean = true): boolean {
		if (skipWhitespace) {
			this.popWhitespace();
		}
		return this.tokens.length > 0;
	}

	/**
	 * Returns the next token but does not advance the iterator.
	 * Skips whitespace by default.
	 */
	peek(skipWhitespace: boolean = true): Token {
		let next = this.peekSafe(skipWhitespace);
		if (next === undefined) {
			throw new Error("No more tokens.");
		}
		return next;
	}

	/**
	 * Returns the next token or undefined if we have reached the end of the list.
	 * Does not advance the iterator and skips whitespace by default.
	 */
	peekSafe(skipWhitespace: boolean = true): Token {
		return this.hasNext(skipWhitespace) ? this.tokens[0] : undefined;
	}

	/**
	 * Returns the next token and advances the iterator.
	 * Skips whitespace by default.
	 */
	pop(skipWhitespace: boolean = true): Token {
		if (this.hasNext(skipWhitespace)) {
			return this.tokens.shift();
		} else {
			throw new Error("No more tokens.");
		}
	}

	/**
	 * Skips a block that starts and ends with a pair of punctuators,
	 * such as braces, paranthesis, and square brackets.
	 */
	skipBlock(): void {
		let start = this.pop().value;
		if (!R.has(start, OPENING_TO_CLOSING_PUNCTUATOR_MAP)) {
			throw new Error(`'${start}' is not a valid opening punctuator.`);
		}
		let end: string = OPENING_TO_CLOSING_PUNCTUATOR_MAP[start];
		let next: string;
		while (this.hasNext() && (next = this.peek().value) !== end) {
			if (R.has(next, OPENING_TO_CLOSING_PUNCTUATOR_MAP)) {
				this.skipBlock();
			} else {
				this.pop();
			}
		}
		if (!this.hasNext()) {
			throw new Error(`Unterminated '${start}'.`);
		}
		// Pop closing punctuator.
		this.pop();
	}

	// Advances the iterator until a non-whitespace token is encountered.
	private popWhitespace(): void {
		while (this.tokens.length > 0 && WHITESPACE.test(this.tokens[0].value)) {
			this.tokens.shift();
		}
	}
}
