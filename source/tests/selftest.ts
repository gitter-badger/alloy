import { tokens } from "../parser/tokens"
import { Lexer }  from "../parser/lexer"

export let selftest = ():void => {

  // Simple Lexer test
  new Lexer(tokens).generateTokens(`import { Lexer } from "./parser/lexer"`)
}
