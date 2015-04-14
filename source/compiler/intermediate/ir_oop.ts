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
enum ModuleType {
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
  constructor(public module: ImportModule,
              public declarations: ImportDeclaration[]) {}
}

/**
 * IR element that represents an export statement.
 */
export class ExportElement implements Element {
  constructor(public properties: Map<string, string>,
              public defaultProperty?: string) {}
}

/**
 * IR element that represents unparsed text.
 * i.e. code that Alloy is not concerned with.
 */
export class UnparsedElement implements Element {
  constructor(public text: string) {}
}

/**
 * Represents an import statement's module specification.
 */
export class ImportModule {
  constructor(public spec: string,
              public type: ModuleType) {}
}

/**
 * Represents properties imported from a module as declared
 * in an import statement.
 */
export class ImportDeclaration {
  constructor(public property: string,
              public alias?: string) {}
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
      let importModule =
        new ImportModule(elem.module["uri"], ModuleType.URI);

      // Pull out import declarations.
      let aliasToDeclaration = (alias: string) => {
        let property = elem.declarations[alias]["property"];
        return new ImportDeclaration(property, alias);
      };
      let importDeclarations: ImportDeclaration[] =
          R.map(aliasToDeclaration, R.keys(elem.declarations));

      return new ImportElement(importModule, importDeclarations);

    } else if (jsonElem.type === "export_declaration") {
      let elem = <jsonIR.export_declaration>jsonElem;
      let properties = new Map<string, string>();
      for (let prop of R.keys(elem.properties)) {
        properties.set(prop, elem.properties[prop]["text"]);
      }
      let defaultProperty = elem.properties["default"];
      return new ExportElement(properties, defaultProperty);

    } else if (jsonElem.type === "unparsed") {
      return new UnparsedElement((<jsonIR.unparsed>jsonElem).text);

    } else {
      throw new Error("Encountered unknown element.");
    }
  };
  return R.map(adapter, json);
}
