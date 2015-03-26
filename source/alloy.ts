/*

alloy.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

import { Lexer } from "./parser/lexer"
import { chalk } from "./vendor/npm"

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
new Lexer().generateTokens(`import { Lexer } from "./parser/lexer"`)
