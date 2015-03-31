import { chalk, commander, package_json } from "../vendor/npm"
import { selftest } from "./command_modules/tests/selftest"

/*

alloy.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

/*

Splash Screen

*/

console.log(chalk.yellow(`
            __ __
     ___ _ / // /__  __ __
   / _  // // // _ \\/ // /    Alloy v${package_json.version}
   \\_,_//_//_/ \\___/\\_, /     ES6 Modules for Polyglot Web Components
                   /___/`))

/*

Setup command interface

*/

commander
  .version(package_json.version)
  .option("-t, --selftest", "run alloy's own unit tests")
  .parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length) {
	commander.outputHelp()
}

// Route commands to modules
commander.selftest && selftest()
