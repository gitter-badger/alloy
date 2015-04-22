import { Declaration, Element, ExportElement, ImportElement, Module, ModuleType } from "../../../intermediate/ir_oop";
import { chalk } from "../../../../../vendor/npm";
import Lexer  from "./JSLexer";
import Parser from "../../Parser";
import TOKENS from "./JSTokens";
import Token from "../../Token";


const WHITESPACE = /\s/;

/**
 * Generates an alloy intermediate representation for JS-like languages
 * (JS, TS, etc). Terminology used
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
export default class JSParser implements Parser {

	private tokens: TokenIterator;

	public parse(code: string): Element[] {
		let result: Element[] = [];

		let lexer  = new Lexer(TOKENS);
		this.tokens = new TokenIterator(lexer.generateTokens(code));

		while (this.tokens.hasNext(true /* skipWhitespace */)) {
			if (this.tokens.peek().value === "import") {
				result.push(this.parseImportDeclaration());
			} else {
				// TODO(icetraxx,joeloyj): Handle exports or unparsed elements.
				this.tokens.pop();
			}
		}

		return result;
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
			let mod = this.parseFromClause()
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
			declarations = declarations.concat(this.parseNamedImports());
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

	// Parses an identifier for an imported binding.
	private parseImportedBinding(): string {
		return this.parseName("identifier for imported binding");
	}

	// Parses a namespace import, e.g. * as foo
	private parseNamespaceImport(): Declaration {
		this.consume("*");
		this.consume("as");
		return new Declaration(this.parseImportedBinding());
	}

	// Parses a list of named imports, e.g. { x as y, z }
	private parseNamedImports(): Declaration[] {
		this.consume("{");
		if (this.maybeConsume("}")) {
			return [];
		}

		let declarations: Declaration[] = [];
		do {
			declarations.push(this.parseImportSpecifier());
		} while (this.maybeConsume(",") && this.tokens.peek().value !== "}");

		this.consume("}");
		return declarations;
	}

	// Parses an import specifier, e.g. x as y
	private parseImportSpecifier(): Declaration {
		let binding = this.parseImportedBinding();
		if (this.maybeConsume("as")) {
			return new Declaration(this.parseImportedBinding(), binding);
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

	// Parses string literal i.e. "foo", 'foo', or `foo`.
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
		if (this.hasNext(skipWhitespace)) {
			return this.tokens[0];
		} else {
			throw new Error("No more tokens.");
		}
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

	// Advances the iterator until a non-whitespace token is encountered.
	private popWhitespace(): void {
		while (this.tokens.length > 0 && WHITESPACE.test(this.tokens[0].value)) {
			this.tokens.shift();
		}
	}
}
