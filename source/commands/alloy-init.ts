import { CONFIG_PATH } from "../lib/constants";
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

try {
  fs.statSync(CONFIG_PATH);
  console.error(chalk.red("alloy: Alloy configuration already exists."));
  process.exit();
} catch (e) {
  if (e.errno !== -2) {
    // Got a stat error other than ENOENT (file not found).
    console.error(e.toString());
    console.error(chalk.red("alloy: init failed due to stat error."));
    process.exit();
  }
}

// TODO(joeloyj): Add interactive configuration.
let config: Object = {};

try {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
  console.info(chalk.yellow("Created Alloy configuration."));
} catch (e) {
  console.error(e.toString());
  console.error(chalk.red("alloy: error writing .alloy config."));
}
