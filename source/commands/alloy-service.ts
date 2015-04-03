import { Process } from "types";
import { chalk, commander } from "../../vendor/npm";
import { lookupService } from "../service/utils";
import Client from "../service/client";
import Server from "../service/server";

/**
 * alloy-service.js
 *
 * Alloy service.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Notion Labs, Inc
 * @copyright 2015 Google Inc
 */

const description: string = `Utility for interacting with Alloy service.`;
const commands: string[] = ["start", "stop"];

commander.description(description);

commander
    .command("start [pathspec...]")
    .description(`Starts Alloy service and optionally watches files
                     given by [pathspec...].
`)
    .action(start);

commander
    .command("stop")
    .description("Stops Alloy service.")
    .action(stop);

commander.parse(process.argv);

// Output help if no command was provided.
if (!process.argv.slice(2).length) {
  commander.help();
}

// Show error message if command was not recognized.
if (commander.args.length
    && typeof commander.args[0] === "string"
    && commands.indexOf(commander.args[0]) === -1) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-service " +
      "command. See 'alloy service --help'.");
  process.exit();
}

/**
 * Starts the Alloy service if it is not already running.
 */
function start(): void {
  // Before starting the service, check that there isn't already a
  // running instance.
  lookupService((results: Process[]): void => {
    if (results.length > 1) {
      console.error(chalk.red("Alloy service is already running.",
          "\nUse \"alloy watch [pathspec..]\" instead."));
      return;
    }

    // Start Alloy service and watch any given paths.
    new Server().start();
    let args = process.argv.slice(3);
    if (args.length) {
      new Client().watch(args, () => {});
    }
  });
}

/**
 * Stops the alloy service if it is running.
 */
function stop(): void {
  // Lookup the Alloy service to see if it's running.
  lookupService((results: Process[]): void => {
    if (results.length === 1) {
      console.error(chalk.red("Alloy service is not running."));
      return;
    }

    // Send stop message to Alloy service.
    new Client().stop();
});
}
