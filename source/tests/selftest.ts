import { TOKENS } from "../compiler/frontend/implementation/js-like/TOKENS";
import { Lexer }  from "../compiler/frontend/implementation/js-like/Lexer";
import { Parser } from "../compiler/frontend/implementation/js-like/Parser";
import * as util  from "util";

export let selftest = ():void => {

  // Parser test
  console.log(util.inspect(new Parser().parse(`
    // Destructuring
    import { x } from "./Foo";
    import { x, y } from "./Foo";


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

    console.log(Bar, foo, Test);
    console.log(Foo());

  `), {
    depth : null,
    colors: true
  }));

}
