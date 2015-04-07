import { Process } from "types";
import { chalk, commander } from "../../vendor/npm";
import Client from "../service/Client";
import ServiceUtils from "../service/ServiceUtils";

/**
 * alloy-stop.js
 *
 * Stops the Alloy service.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string = `Stops the Alloy service. File changes will \
no longer trigger automatic builds.`;

commander
    .description(description)
    .parse(process.argv);

// Show error message if there are additional arguments.
if (commander.args.length) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-stop " +
      "command. See 'alloy-stop --help'.");
  process.exit();
}

// Lookup the Alloy service to see if it's running.
ServiceUtils.lookupService((results: Process[]): void => {
  if (results.length === 0) {
    console.error(chalk.red("Alloy service is not running."));
    return;
  }

  // Send stop message to Alloy service.
  new Client().stop();
});
