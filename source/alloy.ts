import { chalk, commander, package_json } from "../vendor/npm";
import { selftest } from "./command_modules/tests/selftest";

/**
 * alloy.js
 *
 * @file ES6 Modules for Polyglot Web Components.
 * @copyright 2015 Notion Labs, Inc
 * @copyright 2015 Google Inc
 *
 * @author Chris Prucha (chris@makenotion.com)
 * @author Joel Ong (joelo@google.com)
 */

const commands: string[] = ["build", "watch", "service"];

// Splash Screen
console.log(chalk.yellow(`
            __ __
     ___ _ / // /__  __ __
   / _  // // // _ \\/ // /    Alloy v${package_json.version}
   \\_,_//_//_/ \\___/\\_, /     ES6 Modules for Polyglot Web Components
                   /___/
`));

// Setup command interface
commander
  .version(package_json.version)
  .description("ES6 Modules for Polyglot Web Components")
  .command("build [pathspec...]", "build files, defaults to working directory")
  .command("config [set|get]", "get or set properties, displays all by default")
  .command("init", "initialize Alloy with interactive configuration setup")
  .command("watch [pathspec...]", "watch files, defaults to working directory")
  .command("service [start|stop]", "start or stop Alloy service")
  .command("status", "display service and build status")
  .command("trace [file]", "show dependencies within default of 3 degrees")
  .option("-t, --selftest", "run alloy's own unit tests")
  .parse(process.argv);

// Output help by if no command was provided.
if (!process.argv.slice(2).length) {
	commander.help();
}

// Show error message if command is unrecognized.
if (commander.args.length && commands.indexOf(commander.args[0]) === -1) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy " +
      "command. See 'alloy --help'.");
  process.exit();
}

// Route commands to modules
commander.selftest && selftest();
