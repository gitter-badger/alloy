import Token from "./Token";

/**
 * Interface for lexer which generates a list of tokens.
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
interface Lexer {
	generateTokens(code: string): Token[];
}

export default Lexer;
