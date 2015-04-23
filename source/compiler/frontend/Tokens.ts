/**
 * Interface for declarative token matching.
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */
interface Tokens {
  // TODO(Chris): add reserved names
	constants              : string[];
	operators              : string[];
	comment_delimiters     : string[];
	token_delimiters       : string[];
	string_delimiters      : string[];
}

export default Tokens;
