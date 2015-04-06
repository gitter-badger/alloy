import { chalk, commander, fs } from "../../vendor/npm";
import { Config } from "../lib/config";

/**
 * alloy-config.js
 *
 * Alloy configuration utility.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Utility for configuring Alloy. Displays all configured properties by default.

  Available properties:
    paths     an array of paths to monitor for file changes for automatic builds
    exclude   an array of paths to exclude from automatic building

  All properties use JSON notation, and file paths can be specified in any form
  supported by anymatch. See https://github.com/es128/anymatch.`;
const commands: string[] = ["list", "get", "set", "delete"];

commander.description(description);

commander
    .command("list")
    .description("list values for all properties (default)")
    .action(list);

commander
    .command("get [property]")
    .description("displays the value of the given property")
    .action(getProperty);

commander
    .command("set [property] [value]")
    .description("sets the value of the given property")
    .action(setProperty);

commander
    .command("delete [property]")
    .description("deletes the given property")
    .action(deleteProperty);

commander.parse(process.argv);

// Show error message if command was not recognized.
if (commander.args.length
    && typeof commander.args[0] === "string"
    && commands.indexOf(commander.args[0]) === -1) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-config " +
      "command. See 'alloy-config --help'.");
  process.exit();
}

// Default to list if no command was given.
if (!commander.args.length) {
  list();
}

/**
 * Lists all of the properties that are configured.
 */
function list(): void {
  console.log(chalk.yellow("Alloy configuration:\n" + getConfig().toString()));
}

/**
 * Displays the value of the given property.
 */
function getProperty(): void {
  // Show usage if there no property was specified.
  if (!commander.args.length || typeof commander.args[0] !== "string") {
    commander.help();
  }
  // Make sure Alloy is configured.
  let config: Config = getConfig();

  // Check that the specified property is valid.
  checkProperty(commander.args[0]);

  if (config.isPropertyConfigured(commander.args[0])) {
    console.log(chalk.yellow(
        commander.args[0], "=", config.getProperty(commander.args[0])));
  } else {
    console.error(
        chalk.yellow(`alloy: property '${commander.args[0]}' is not set.`));
  }
  process.exit();
}

/**
 * Sets the value of the given property.
 */
function setProperty(): void {
  // Show usage if there no property or value was specified.
  if (commander.args.length < 2 || typeof commander.args[0] !== "string"
      || typeof commander.args[1] !== "string") {
    commander.help();
  }
  // Make sure Alloy is configured.
  let config: Config = getConfig();

  // Check that the specified property is valid.
  checkProperty(commander.args[0]);

  config.setProperty(commander.args[0], commander.args[1]);
  try {
    config.write();
    console.log(chalk.yellow(
        "Alloy configuration property set:\n" + commander.args[0],
        "=", commander.args[1]));
  } catch (e) {
    console.error(e.toString());
    console.error(chalk.red("alloy: error writing Alloy configuration."));
  }
  process.exit();
}

/**
 * Deletes the given property.
 */
function deleteProperty(): void {
  // Show usage if there no property was specified.
  if (!commander.args.length || typeof commander.args[0] !== "string") {
    commander.help();
  }
  // Make sure Alloy is configured.
  let config: Config = getConfig();

  // Check that the specified property is valid.
  checkProperty(commander.args[0]);

  if (!config.isPropertyConfigured(commander.args[0])) {
    console.error(
        chalk.yellow(`alloy: property '${commander.args[0]}' is not set.`));
    process.exit();
  }

  let value = config.getProperty(commander.args[0]);
  config.deleteProperty(commander.args[0]);
  try {
    config.write();
    console.log(
      chalk.yellow("Deleted property:", commander.args[0], "=", value));
  } catch (e) {
    console.error(e.toString());
    console.error(chalk.red("alloy: error writing Alloy configuration."));
  }
  process.exit();
}

/**
 * Retrieves the current configuration from the .alloy config file.
 * Aborts with an error message if no configuration is found.
 */
function getConfig(): Config {
  try {
    return new Config().read(process.cwd());
  } catch (e) {
    if (e.errno === -2) {
      console.error(chalk.red(
          `alloy: Alloy is not configured. See "alloy init --help".`));
    } else {
      // Got a stat error other than ENOENT (file not found).
      console.error(e.toString());
      console.error(chalk.red("alloy: error reading Alloy configuration."));
    }
    process.exit();
  }
}

/**
 * Checks that the given property name is valid, otherwise prints an error
 * message and aborts the script.
 */
function checkProperty(property: string): void {
  try {
    Config.checkValidProperty(property);
  } catch (e) {
    console.error(chalk.red("alloy: " + e.message));
    process.exit();
  }
}
