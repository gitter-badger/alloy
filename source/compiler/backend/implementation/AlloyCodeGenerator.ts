import { CodeGenerator } from "../CodeGenerator";
import { Element } from "../../intermediate/ir";
import { ramda as R } from "../../../../vendor/npm";
import * as ir from "../../intermediate/ir";

/**
 * Code generator backed by Alloy's module system.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class AlloyCodeGenerator implements CodeGenerator {

  /**
   * Generates code from IR using Alloy's module system.
   */
  public generate(intermediate: Element[]): string {
    let processIR: (string, IRElement) => string = (acc, elem) => {
      return acc + AlloyCodeGenerator.generateFromElement(elem);
    }
    return R.reduce(processIR, "", intermediate);
  }

  /**
   * Generates code from a single IR element. Code for module import and
   * export elements are generated using Alloy's module syntax.
   */
  private static generateFromElement(element: ir.Element): string {
    if (element instanceof ir.ImportElement) {
      return AlloyCodeGenerator.generateImports(element);

    } else if (element instanceof ir.ExportElement) {
      // TODO(joeloyj): Implement exports.
      return "\n\n// TODO(joeloyj): Exports go here!!! \n\n";

    } else if (element instanceof ir.UnparsedElement) {
      return element.text;

    } else {
      throw new Error("Encountered unknown element type: " + element);
    }
  }

  /**
   * Generates Alloy import code given an IR element parsed from original code.
   *
   * For example, given an IR element parsed from the following code:
   *   import { * as foo, bar } from "./foo";
   *
   * This method generates the following code:
   *   var foo, bar;
   *   (function (foo, bar) {
   *     var module = alloy.require("./foo");
   *     foo = module;
   *     bar = module.bar;
   *   })(foo, bar);
   */
  private static generateImports(element: ir.ImportElement): string {
    let commaSeparatedAliases = AlloyCodeGenerator.commaSepAliases(element);

    // First declare import aliases in module scope. e.g. "var foo, bar;"
    let code: string = `var ${commaSeparatedAliases};\n`;

    // Wrap import code in anonymous function. e.g. "(function(foo, bar) {"
    code += `(function(${commaSeparatedAliases}) {\n`;

    // Import module from Alloy. e.g. "var module = alloy.require(./foo);"
    code +=`  var module = alloy.require(${element.module.spec});\n`;

    // Assign import aliases to their corresponding properties.
    // e.g. foo = module;
    //      bar = module.bar;
    code = R.reduce((acc, declaration) => {
      let propSuffix = declaration.property ? "." + declaration.property : "";
      return acc += `  ${declaration.alias} = module${propSuffix};\n`;
    }, code, element.declarations);

    // Execute anonymous function. e.g. "})(foo, bar);"
    return code + `})(${commaSeparatedAliases});\n`
  }

  /**
   * Returns a string of comma separated aliases from an import statement.
   * e.g.   import { * as foo, bar, baz as quux } from "./some/module";
   *     -> foo, bar, quux
   */
  private static commaSepAliases(element: ir.ImportElement): string {
    let stringify = (acc, elem, i, list) => {
      let maybeComma = i === list.length - 1 ? "" : ", ";
      return acc + elem.alias + maybeComma;
    }
    return R.reduceIndexed(stringify, "", element.declarations);
  }
}
