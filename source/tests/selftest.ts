import { TOKENS } from "../compiler/frontend/implementation/js-like/TOKENS";
import { Lexer }  from "../compiler/frontend/implementation/js-like/Lexer";
import { Parser } from "../compiler/frontend/implementation/js-like/Parser";

export let selftest = ():void => {

  // Simple Lexer test
  console.log(new Lexer(TOKENS).generateTokens(`
    import { Bar } from "./bar";
    import * as foo from "./foo";
    import Test from "./test";

    function Foo () {
      var a = "ap{ple";
      var b = 23423;
      return a + b;
    }

    console.log(Bar, foo, Test);
    console.log(Foo());
  `));

  // console.log(new Parser().parse(`
  //   import { Bar } from "./bar";
  //   import * as foo from "./foo";
  //   import Test from "./test";
  //
  //   function Foo () {
  //     var a = "apple";
  //     var b = 23423;
  //     return a + b;
  //   }
  //
  //   console.log(Bar, foo, Test);
  //   console.log(Foo());
  // `));
}
