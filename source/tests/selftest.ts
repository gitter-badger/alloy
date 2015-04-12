import { Tokens } from "../compiler/frontend/implementation/js-like/Tokens";
import { Lexer }  from "../compiler/frontend/implementation/js-like/Lexer";

export let selftest = ():void => {

  // Simple Lexer test
  console.log(new Lexer(Tokens).generateTokens(`
    import { Lexer } from "./parser/lexer";

    console.log(Lexer);

  `));
}
