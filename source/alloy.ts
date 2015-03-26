import { chalk, commander }  from "./vendor/npm"
import { selftest } from "./tests/selftest"

/*

alloy.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

const version = "0.0.1"

/*

Splash Screen

*/

console.log(chalk.yellow(`
            __ __
     ___ _ / // /__  __ __
   / _  // // // _ \\/ // /    Alloy v${version}
   \\_,_//_//_/ \\___/\\_, /     ES6 Modules for Polyglot Web Components
                   /___/`))

/*

Setup command interface

*/

commander
  .version(version)
  .option("-t, --selftest", "run alloy's own unit tests")
  .parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length) {
	commander.outputHelp()
}

// Route commands to modules
commander.selftest && selftest()
