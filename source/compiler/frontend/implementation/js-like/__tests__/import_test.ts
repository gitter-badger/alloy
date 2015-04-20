import { ramda as R } from "../../../../../../vendor/npm";
import * as ir from "../../../../intermediate/ir_oop";
import Parser from "../JSParser";

/**
 * Tests that parser can handle all valid ES6 import syxtax.
 *
 * @author Joel Ong (joelo@google.com)
 */
describe("JS-like parser", () => {
  const URI = "./Foo";

  let parse = (code) => {
    return new Parser().parse(code);
  }

  let parseStatement = (code) => {
    return parse(code)[0];
  }

  let assert = (statement: string, properties: Object) => {
    let actual = parseStatement(statement);
    let toDeclaration = key => new ir.Declaration(key, properties[key]);
    let declarations = R.map(toDeclaration, R.keys(properties));
    let mod = new ir.Module(URI, ir.ModuleType.URI);
    expect(actual).toEqual(new ir.ImportElement(mod, declarations));
  }

  it("parses named imports", () => {
    assert(`import {} from "${URI}";`, {});
    assert(`import { x } from "${URI}";`, { x: "x" });
    assert(`import { x, } from "${URI}";`, { x: "x" });
    assert(`import { x, y } from "${URI}";`, { x: "x", y: "y" });
    assert(`import { x, y, } from "${URI}";`, { x: "x", y: "y" });
  });

  it("parses renamed imports", () => {
    assert(`import { x as u } from "${URI}";`, { u: "x" });
    assert(`import { x as u, } from "${URI}";`, { u: "x" });
    assert(`import { x as u, y as v } from "${URI}";`, { u: "x", v: "y" });
    assert(`import { x as u, y as v, } from "${URI}";`, { u: "x", v: "y" });
  });

  it("parses named imports with selective renaming", () => {
    assert(`import { x as u, y } from "${URI}";`, { u: "x", y: "y" });
    assert(`import { x, y as v, } from "${URI}";`, { x: "x" , v: "y"});
    assert(`import { x as u, y, z as w } from "${URI}";`,
        { u: "x" , y: "y", w: "z"});
    assert(`import { x, y as v, z, p as q, r, } from "${URI}";`,
        { x: "x", v: "y", z: "z", q: "p", r: "r" });
  });

  // Imports the module as an object with one property per named export.
  it("parses namespace imports", () => {
    assert(`import * as x from "${URI}";`, { x: undefined });
  });

  it("parses default binding imports", () => {
    assert(`import x from "${URI}";`, { x: "default" });
  });

  it("parses imports with default binding followed by namespace import", () => {
    assert(`import x, * as y from "${URI}";`, { x: "default", y: undefined });
  });

  it("parses imports with default binding followed by named imports", () => {
    assert(`import x, {} from "${URI}";`, { x: "default" });
    assert(`import x, { y } from "${URI}";`, { x: "default", y: "y" });
    assert(`import x, { y, } from "${URI}";`, { x: "default", y: "y" });
    assert(`import x, { y, z } from "${URI}";`, { x: "default", z: "z" });
    assert(`import x, { y, z, } from "${URI}";`, { x: "default", z: "z" });
  });

  it("parses imports with default binding followed by renamed imports", () => {
    assert(`import a, { x as u, y } from "${URI}";`,
        { a: "default", u: "x", y: "y" });
    assert(`import a, { x, y as v, } from "${URI}";`,
        { a: "default", x: "x", v: "y"});
    assert(`import a, { x as u, y, z as w } from "${URI}";`,
        { a: "default", u: "x", y: "y", w: "z" });
    assert(`import a, { x, y as v, z, p as q, r, } from "${URI}";`,
        { a: "default", x: "x", v: "y", z: "z", q: "p", r: "r" });
  });

  it("parses an import with only module loading", () => {
    assert(`import "${URI}";`, {});
  });

  // TODO(joeloyj): Add tests for invalid import syntax.
});
