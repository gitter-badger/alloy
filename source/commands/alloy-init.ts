import { chalk, commander } from "../../vendor/npm";
import FileConfig from "../config/FileConfig";

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

// TODO(joeloyj): Add interactive configuration.
new FileConfig(process.cwd()).create().then(
  config => {
    console.info(chalk.yellow("Created Alloy configuration."));
  },
  err => {
    if (err.hasOwnProperty("errno")) {
      console.error(err.toString());
      console.error(chalk.red("alloy: init failed."));
    } else {
      console.error(chalk.red("alloy: " + err.message));
    }
    process.exit();
  });
