import { Element } from "../intermediate/ir";

/**
 * Interface for parser which generates IR from a list of tokens.
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
interface Parser {
	parse(code: string): Element[];
}

export default Parser;
