import { Config } from "../lib/config";
import { chalk, commander, fs } from "../../vendor/npm";

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

let config: Config;
try {
  config = new Config(process.cwd()).create();
} catch (e) {
  if (e.hasOwnProperty("errno")) {
    console.error(e.toString());
    console.error(chalk.red("alloy: init failed due to stat error."));
  } else {
    console.error(chalk.red("alloy: " + e.message));
  }
  process.exit();
}

// TODO(joeloyj): Add interactive configuration.
try {
  config.write();
  console.info(chalk.yellow("Created Alloy configuration."));
} catch (e) {
  console.error(e.toString());
  console.error(chalk.red("alloy: error writing .alloy config."));
}
