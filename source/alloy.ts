import { BANNER } from "./lib/constants";
import { commander, package_json } from "../vendor/npm";
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

// Splash Screen
console.log(BANNER);

// Setup command interface
commander
  .version(package_json.version)
  .description("ES6 Modules for Polyglot Web Components")
  .command("build [pathspec...]", "build files, defaults to working directory")
  .command("watch [pathspec...]", "watch files, defaults to working directory")
  .command("service [start|stop]", "start or stop Alloy service")
  .option("-t, --selftest", "run alloy's own unit tests")
  .parse(process.argv);

// Output help by default
if (!process.argv.slice(2).length) {
	commander.outputHelp();
}

// Route commands to modules
commander.selftest && selftest();
