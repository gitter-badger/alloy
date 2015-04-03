import { chalk, commander } from "../../vendor/npm";

/**
 * alloy-config.js
 *
 * Alloy configuration utility.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Utility for configuring Alloy. Displays all configured properties by default.`;
const commands: string[] = ["list", "get", "set"];

commander.description(description);

commander
    .command("list")
    .description("list values for all properties (default)");

commander
    .command("get [property]")
    .description("displays the value of the given property");

commander
    .command("set [property] [value]")
    .description("sets the value of the given property");

commander.parse(process.argv);

// Show error message if command was not recognized.
if (commander.args.length
    && typeof commander.args[0] === "string"
    && commands.indexOf(commander.args[0]) === -1) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-config " +
      "command. See 'alloy-config --help'.");
  process.exit();
}

// TODO(joeloyj): Implement.
console.error(chalk.red("Not implemented."));
