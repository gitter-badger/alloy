import * as jsonIR from "./ir";
import { ramda as R } from "../../../vendor/npm";

/**
 * Intermediate representation (IR) module.
 *
 * @author Joel Ong (joelo@google.com)
 */

/**
 * Enumeration of possible types of module specifications, such as a URI or
 * a global identifier.
 */
export enum ModuleType {
  URI
}

/**
 * Base interface implemented by all IR elements.
 */
export interface Element {}

/**
 * IR element that represents an import statement.
 */
export class ImportElement implements Element {
  constructor(
      // Module spec defined by "from" clause.
      public module: Module,
      // Import declarations. Can be empty if nothing is imported,
      // in which case the module is only loaded.
      public declarations: Declaration[]) {}
}

/**
 * IR element that represents an export statement.
 */
export class ExportElement implements Element {
  constructor(
      // Declarations, can be undefined if this is a namespace re-export
      // from another module.
      public declarations: Declaration[],
      // Parsed text of the export statement, with export syntax removed
      // and the default export, if any, assigned to a unique identifier.
      // public text: string,
      // Module spec, only applicable for re-exports.
      public reExportModule?: Module) {}
}

/**
 * IR element that represents unparsed text.
 * i.e. code that Alloy is not concerned with.
 */
export class UnparsedElement implements Element {
  constructor(
      // The unparsed text.
      public text: string) {}
}

/**
 * Represents an import or re-export statement's module specification.
 */
export class Module {
  constructor(
      // Spec for the module, such as a relative path or a global name.
      public spec: string,
      // Type of the module spec.
      public type: ModuleType) {}
}

/**
 * Represents properties imported or exported from a module as declared
 * with an import or export statement.
 */
export class Declaration {
  constructor(
      // Alias for the exported or imported property. This is:
      //   - For exports: the name that other modules will see instead.
      //   - For imports: the name that is used instead of the exported name.
      public alias: string,

      // Exported or imported property that this declaration refers to.
      // For exports:
      //   - For named exports, this is the actual name of the property.
      //   - For namespace exports, this will be absent or undefined.
      //   - If this is a default export, then this property refers to the
      //     identifier that the exported expression is assigned to by the
      //     parser. This assignment should be reflected in the code provided
      //     in the ExportElement.
      // For imports:
      //   - A value of "default" indicates that we should import the
      //     default binding under the alias specified above.
      //   - If not specified or undefined, it means that we should perform
      //     a module namespace import, where exported properties are made
      //     available as properties of an object with the alias above.
      public property?: string) {}
}

// TODO(joeloyj): Remove this after frontend code is refactored.
/**
 * Converts from a JSON-compatible Object representation of IR to
 * the canonical form as described in this module.
 */
export let fromJson = (json: jsonIR.ir|Error): Element[] => {
  if (json instanceof Error) {
    throw json;
  }
  let adapter = (jsonElem: jsonIR.IRElement): Element => {
    if (jsonElem.type === "import_declaration") {
      let elem = <jsonIR.import_declaration> jsonElem;

      // Convert module spec.
      if (elem.module["type"] !== "uri") {
        throw new Error("Encountered unknown type of import.");
      }
      let importModule = new Module(elem.module["uri"], ModuleType.URI);

      // Pull out import declarations.
      let aliasToDeclaration = (alias: string) => {
        let property = elem.declarations[alias]["property"];
        return new Declaration(alias, property);
      };
      let importDeclarations: Declaration[] =
          R.map(aliasToDeclaration, R.keys(elem.declarations));

      return new ImportElement(importModule, importDeclarations);

    } else if (jsonElem.type === "export_declaration") {
      let elem = <jsonIR.export_declaration>jsonElem;
      let declarations =
          R.map(key => elem.declarations[key], R.keys(elem.declarations));

      // Convert module spec.
      let reExportModule;
      if (R.has("module", elem)) {
        if (elem.module["type"] !== "uri") {
          throw new Error("Encountered unknown type of re-export.");
        }
        reExportModule = new Module(elem.module["uri"], ModuleType.URI);
      }

      return new ExportElement(declarations, /*elem.text,*/ reExportModule);

    } else if (jsonElem.type === "unparsed") {
      return new UnparsedElement((<jsonIR.unparsed>jsonElem).text);

    } else {
      throw new Error("Encountered unknown element.");
    }
  };
  return R.map(adapter, json);
}
