import { ramda as R } from "../../../../../../vendor/npm";
import * as ir from "../../../../intermediate/ir_oop";
import Parser from "../JSParser";

/**
 * Tests that parser can handle all valid ES6 export syxtax.
 *
 * @author Joel Ong (joelo@google.com)
 */
describe("JS-like parser", () => {
  const URI = "./Foo";
  const DEFAULT_VAR = "__alloy_default";

  let parse = (code) => {
    return new Parser().parse(code);
  }

  let parseStatement = (code) => {
    return ir.fromJson(parse(code))[0];
  }

  let assert =
      (statement: string, properties: Object, isReExport?: boolean) => {
    let actual = parseStatement(statement);
    let toDeclaration = key => new ir.Declaration(key, properties[key]);
    let declarations = R.map(toDeclaration, R.keys(properties));
    let mod = isReExport
        ? new ir.Module(URI, ir.ModuleType.URI)
        : undefined;
    statement = R.replace("/export /g", "", statement);
    statement = R.replace("/default /g", `var ${DEFAULT_VAR} = `, statement);
    let exected = new ir.ExportElement(declarations, statement, mod);
    expect(actual).toEqual(exected);
  }

  it("parses exported 'var' declarations", () => {
    assert(`export var a;`, { a: "a" });
    assert(`export var a = 123;`, { a: "a" });
  });

  it("parses exported 'let' declarations", () => {
    assert(`export let a;`, { a: "a" });
    assert(`export let a = 123;`, { a: "a" });
    assert(`export let a = (x) => { return x; });`, { a: "a" });
  });

  it("parses exported 'const' declarations", () => {
    assert(`export const FOO = 123;`, { FOO: "FOO" });
  });

  it("parses exported function declarations", () => {
    assert(`export function foo() {};`, { foo: "foo" });
    assert(`export function foo(x) { return x; };`, { foo: "foo" });
  });

  it("parses exported generator function declarations", () => {
    assert(`export function* foo() {};`, { foo: "foo" });
  });

  it("parses exported class declarations", () => {
    assert(`export class Foo {};`, { Foo: "Foo" });
  });

  it("parses exported default expressions", () => {
    assert(`export default 123;`, { "default": DEFAULT_VAR });
  });

  it("parses exported default functions", () => {
    assert(`export default function(x) { return x; };`,
        { "default": DEFAULT_VAR });
  });

  it("parses exported default classes", () => {
    assert(`export default class { constructor(private x) {} };`,
        { "default": DEFAULT_VAR });
  });

  it("parses exported lists", () => {
    assert(`export { x };`, { x: "x" });
    assert(`export { x, };`, { x: "x" });
    assert(`export { x, y };`, { x: "x", y: "y" });
    assert(`export { x, y, };`, { x: "x", y: "y" });
  });

  it("parses exported lists with renaming", () => {
    assert(`export { x as u };`, { u: "x" });
    assert(`export { x as u, };`, { u: "x" });
    assert(`export { x as u, y as v };`, { u: "x", v: "y" });
    assert(`export { x as u, y as v, };`, { u: "x", v: "y" });
    assert(`export { x as u, y };`, { u: "x", y: "y" });
    assert(`export { x, y as v, };`, { x: "x" , v: "y"});
    assert(`export { x as u, y, z as w };`, { u: "x" , y: "y", w: "z"});
    assert(`export { x, y as v, z, p as q, r, };`,
        { x: "x", v: "y", z: "z", q: "p", r: "r" });
  });

  it("parses re-exported namespaces from other modules", () => {
    assert(`export * from "${URI}";`, {}, true /* isReExport */);
  });

  it("parses re-exported names from other modules", () => {
    assert(`export { x } from "${URI}";`, { x: "x" }, true /* isReExport */);
    assert(`export { x, } from "${URI}";`, { x: "x" }, true);
    assert(`export { x, y } from "${URI}";`, { x: "x", y: "y" }, true);
    assert(`export { x, y, } from "${URI}";`, { x: "x", y: "y" }, true);
  });

  it("parses re-exported names from other modules with renaming", () => {
    assert(`export { x as u } from "${URI}";`,
        { u: "x" }, true /* isReExport */);
    assert(`export { x as u, } from "${URI}";`, { u: "x" }, true);
    assert(`export { x as u, y as v } from "${URI}";`,
        { u: "x", v: "y" }, true);
    assert(`export { x as u, y as v, } from "${URI}";`,
        { u: "x", v: "y" }, true);
    assert(`export { x as u, y } from "${URI}";`, { u: "x", y: "y" }, true);
    assert(`export { x, y as v, } from "${URI}";`, { x: "x" , v: "y"}, true);
    assert(`export { x as u, y, z as w } from "${URI}";`,
        { u: "x" , y: "y", w: "z"}, true);
    assert(`export { x, y as v, z, p as q, r, } from "${URI}";`,
        { x: "x", v: "y", z: "z", q: "p", r: "r" }, true);
  });

  it("fails when parsing multiple default exports", () => {
    expect(() => parse(`export default let a = 123;
                        export default class {};`))
        .toThrow();
  });

  it("fails when parsing export not declared at module scope level", () => {
    expect(() => parse(`() => { export let a = 123; }`)).toThrow();
  });

  it("fails when parsing exported expression that is not default", () => {
    expect(() => parse(`export 123;`)).toThrow();
  });

  it("fails when parsing exported unnamed function that is not default", () => {
    expect(() => parse(`export function(x) { return x; };`)).toThrow();
  });

  it("fails when parsing exported unnamed class that is not default", () => {
    expect(() => parse(`export class {};`)).toThrow();
  });

  it("fails when parsing re-exported namespaces with renaming", () => {
    expect(() => parse(`export * as x from "${URI}";`)).toThrow();
  });
});
