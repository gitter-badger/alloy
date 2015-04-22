import { ramda as R } from "../../vendor/npm";
import * as ir from "../compiler/intermediate/ir_oop";
import * as util from "util";
import AlloyCodeGenerator from "../compiler/backend/implementation/AlloyCodeGenerator";
import Parser from "../compiler/frontend/implementation/js-like/JSParser";

/**
 * General tests for Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
describe("Alloy", () => {
  let parse = (code) => {
    return new Parser().parse(code);
  }

  let parseStatement = (code) => {
    return parse(code)[0];
  }

  let codegen = (ir) => {
    return new AlloyCodeGenerator().generate(ir);
  }

  let assertImport = (statement: string, uri: string, properties: Object) => {
    let actual = parseStatement(statement);
    let toDeclaration = key => new ir.Declaration(key, properties[key]);
    let declarations = R.map(toDeclaration, R.keys(properties));
    let mod = new ir.Module(uri, ir.ModuleType.URI);
    expect(actual).toEqual(new ir.ImportElement(mod, declarations));
  }

  var debug = (o) => {
    console.log(util.inspect(o, {
      depth : null,
      colors: true
    }));
    return o;
  }

  // TODO(joeloyj): Figure out what tests go here.

  it("parser and codegen integration", () => {
    debug(codegen(debug(parse(`
      import { x, y } from "./Foo";
      import x from "./bar";
      import { x } from "./Foo";

      alert("!");
    `))));
  });

  it("parser and codegen kitchen sink test", () => {
    debug(codegen(debug(parse(`
      import { Ff2_oo as Y } from "./Foo";

      function Foo () {
        var a = "apple";
        var b = 23423;
        return a + b;
      }

      export var u = false;

      export let x = 2.3;

      var y = 2 * 3;

      console.log(Bar, foo, Test);
      console.log(Foo());
    `))));
  });
});
