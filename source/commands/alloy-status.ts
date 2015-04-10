import { Process } from "types";
import { chalk, commander } from "../../vendor/npm";
import ServiceUtils from "../service/ServiceUtils";

/**
 * alloy-status.js
 *
 * Utility for displaying Alloy service status and other build info.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Utility for displaying Alloy service status and other build information.`;

commander
    .description(description)
    .parse(process.argv);

// Show error message if there are additional arguments.
if (commander.args.length) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-status " +
      "command. See 'alloy-status --help'.");
  process.exit();
}

ServiceUtils.lookupService((results: Process[]): void => {
  if (results.length === 0) {
    console.log(chalk.yellow("Alloy service is not running."));
  } else {
    console.log(chalk.yellow("Alloy service is running."));

    // TODO(joeloyj): Implement.
    console.log(chalk.yellow("Last build:"), chalk.red("Not implemented."));
    console.log(chalk.yellow("Source paths:"), chalk.red("Not implemented."));
    console.log(chalk.yellow("Excluded paths:"), chalk.red("Not implemented."));
  }
});
