import { chalk, commander, package_json } from "../vendor/npm";

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

const commands: string[] =
    ["build", "config", "init", "start", "status", "stop", "trace", "watch"];

const destription: string = "Anti-build for the Web & Node."

// Splash Screen
console.log(chalk.yellow(`
            __ __
     ___ _ / // /__  __ __
   / _  // // // _ \\/ // /    Alloy v${package_json.version}
   \\_,_//_//_/ \\___/\\_, /     ${destription}
                   /___/
`));

// Setup command interface
commander
  .version(package_json.version)
  .description(destription)
  .command("build", "build files with Alloy")
  .command("config", "display or set Alloy configuration properties")
  .command("init", "setup Alloy configuration interactively")
  .command("start", "start Alloy service, triggering build when files change")
  .command("status", "display Alloy service status and build info")
  .command("stop", "stop Alloy service")
  .command("trace", "show dependencies within N degrees of a file")
  .command("watch", "watch files using Alloy")
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
