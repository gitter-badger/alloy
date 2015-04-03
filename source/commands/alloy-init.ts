import { chalk, commander } from "../../vendor/npm";

/**
 * alloy-init.js
 *
 * Interactive uility for setting up Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Interactive utility for setting up an Alloy configuration
  for current working directory.`;

commander
    .description(description)
    .parse(process.argv);

// Show error message if there are additional arguments.
if (commander.args.length) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-init " +
      "command. See 'alloy-init --help'.");
  process.exit();
}

// TODO(joeloyj): Implement.
console.error(chalk.red("Not implemented."));
