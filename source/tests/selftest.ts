import { TOKENS } from "../compiler/frontend/implementation/js-like/TOKENS";
import { Lexer }  from "../compiler/frontend/implementation/js-like/Lexer";
import { Parser } from "../compiler/frontend/implementation/js-like/Parser";
import * as ir from "../compiler/intermediate/ir_oop";
import * as util  from "util";
import AlloyCodeGenerator from "../compiler/backend/implementation/AlloyCodeGenerator";

export let selftest = (): void => {
  test_import();
  // test_kitchenSink();
}

var test_import = () => {
  // Parser import test
  let parsed = new Parser().parse(`
    // Destructuring
    import { x, y } from "./Foo";
    import x from "./bar";
    import { x } from "./Foo";

    alert("!");
  `);
  console.log(util.inspect(parsed, {
    depth : null,
    colors: true
  }));

  // Alloy code generator test
  console.log(new AlloyCodeGenerator().generate(ir.fromJson(parsed)));
}

var test_kitchenSink = () => {
  // Parser kitchen sink test
  let parsed = new Parser().parse(`
    // Destructuring
    import { x, y } from "./Foo";
    import x from "sd";
    import { x } from "./Foo";

    // Default
    import y, { x } from "./Foo";
    import y from "./Foo";
    import { default as y } from "./Foo";

    // Aliasing
    import * as y from "./Foo";
    import Ff2_oo as Y from "./Foo";

    // Destructuring + Aliasing
    import { x as y, o } from "./Foo";

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

  `);
  console.log(util.inspect(parsed, {
    depth : null,
    colors: true}));


  // Alloy code generator test
  console.log(new AlloyCodeGenerator().generate(ir.fromJson(parsed)));
}
