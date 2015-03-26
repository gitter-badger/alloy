import { tokens } from "./parser/tokens"
import { Lexer }  from "./parser/lexer"
import { chalk }  from "./vendor/npm"

/*

alloy.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

console.log(chalk.white.bgBlack(`
	 █████╗ ██╗     ██╗      ██████╗ ██╗   ██╗
	██╔══██╗██║     ██║     ██╔═══██╗╚██╗ ██╔╝
	███████║██║     ██║     ██║   ██║ ╚████╔╝
	██╔══██║██║     ██║     ██║   ██║  ╚██╔╝
	██║  ██║███████╗███████╗╚██████╔╝   ██║
	╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝    ╚═╝
	ES6 Modules for Polyglot Web Components
`))

// Test
new Lexer(tokens).generateTokens(`import { Lexer } from "./parser/lexer"`)
