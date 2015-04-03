import { chalk, commander } from "../../vendor/npm";

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

// TODO(joeloyj): Implement.
console.error(chalk.red("Not implemented."));
