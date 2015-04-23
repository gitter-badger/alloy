import { Element } from "../intermediate/ir";

/**
 * Interface for generating code from IR (intermediate representation).
 * Generated code will have import and export declarations
 * specific to the module system in use.
 *
 * @author Joel Ong (joelo@google.com)
 */
export interface CodeGenerator {
  /**
   * Generates code from IR.
   */
  generate(intermediate: Array<Element>): string;
}
