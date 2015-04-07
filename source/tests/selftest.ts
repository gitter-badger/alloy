import { JSTokens } from "../parser/JSTokens"
import { JSLexer }  from "../parser/JSLexer"

export let selftest = ():void => {

  // Simple Lexer test
  new JSLexer(JSTokens).generateTokens(`import { Lexer } from "./parser/lexer"`)
}
