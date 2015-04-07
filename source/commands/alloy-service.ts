import { Process } from "types";
import { chalk, commander } from "../../vendor/npm";
import Client from "../service/client";
import Server from "../service/server";
import ServiceUtils from "../service/ServiceUtils";

/**
 * alloy-service.js
 *
 * Alloy service.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Notion Labs, Inc
 * @copyright 2015 Google Inc
 */

const description: string = "Utility for interacting with Alloy service. "
    + "Starts the service by default.";
const commands: string[] = ["start", "stop"];

commander.description(description);

commander
    .command("start")
    .description("start Alloy service (default)")
    .action(start);

commander
    .command("stop")
    .description("stop Alloy service")
    .action(stop);

commander.parse(process.argv);

// Show error message if command was not recognized.
if (commander.args.length
    && typeof commander.args[0] === "string"
    && commands.indexOf(commander.args[0]) === -1) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-service " +
      "command. See 'alloy service --help'.");
  process.exit();
}

// Default to start if no command was provided.
if (!process.argv.slice(2).length) {
  start();
}

/**
 * Starts the Alloy service if it is not already running.
 */
function start(): void {
  // Before starting the service, check that there isn't already a
  // running instance.
  ServiceUtils.lookupService((results: Process[]): void => {
    if (results.length > 1) {
      console.error(chalk.red("Alloy service is already running."));
      return;
    }

    // Start Alloy service and watch any given paths.
    new Server().start();
  });
}

/**
 * Stops the alloy service if it is running.
 */
function stop(): void {
  // Lookup the Alloy service to see if it's running.
  ServiceUtils.lookupService((results: Process[]): void => {
    if (results.length === 1) {
      console.error(chalk.red("Alloy service is not running."));
      return;
    }

    // Send stop message to Alloy service.
    new Client().stop();
  });
}
