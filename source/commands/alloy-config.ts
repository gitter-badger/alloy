import { chalk, commander } from "../../vendor/npm";
import Config from "../config/Config";
import FileConfig from "../config/FileConfig";
import Properties from "../config/Properties";

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
    src      a list of paths to monitor for file changes for automatic building
    exclude  a list of paths to exclude from automatic building
    out      path of build output folder

  All properties use JSON notation, and file paths can be specified in any form
  supported by anymatch. See https://github.com/es128/anymatch.`;

const commands: string[] = ["add", "delete", "list", "get", "set"];

let processedCommand = false;

commander.description(description);

commander
    .command("add [property] [value]")
    .description("add a value to the given list property")
    .action(addToProperty);
commander
    .command("delete [property]")
    .description("delete the given property")
    .action(deleteProperty);
commander
    .command("get [property]")
    .description("display the value of the given property")
    .action(getProperty);
commander
    .command("list")
    .description("list values for all properties (default)")
    .action(list);
commander
    .command("remove [property] [value]")
    .description("remove a value from the given list property")
    .action(removeFromProperty);
commander
    .command("set [property] [value]")
    .description("set the value of the given property")
    .action(setProperty);

commander.parse(process.argv);

// Show error message if command was not recognized.
if (!processedCommand
    && commander.args.length
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
  processedCommand = true;
  getConfigAndApply(config =>
    console.log(chalk.yellow("Alloy configuration:\n" + config.toString())));
}

/**
 * Displays the value of the given property.
 */
function getProperty(): void {
  processedCommand = true;
  let property: string = commander.args[0];

  // Show usage if there no property was specified.
  if (!commander.args.length || typeof property !== "string") {
    commander.help();
  }

  getConfigAndApply(config => {
    // Check that the specified property is valid.
    checkProperty(property);

    if (config.isConfigured(property)) {
      console.log(chalk.yellow(property, "=",
          JSON.stringify(config.getConfig()[property], null, 2)));
    } else {
      console.log(chalk.yellow(`alloy: property '${property}' is not set.`));
    }
    process.exit();
  });
}

/**
 * Sets the value of the given property.
 */
function setProperty(): void {
  processedCommand = true;
  let property: string = commander.args[0];
  let value: string = commander.args[1];

  // Show usage if there no property or value was specified.
  if (commander.args.length < 2 || typeof property !== "string"
      || typeof value !== "string") {
    commander.help();
  }

  getConfigAndApply(config => {
    // Check that the specified property is valid.
    checkProperty(property);

    try {
      if (Properties.isString(property)) {
        config.setString(property, value);
      } else if (Properties.isList(property)) {
        config.setList(property, value);
      }
    } catch (e) {
      console.error(chalk.red(`alloy: ${e.message}`));
      process.exit();
    }

    config.write().then(
      config => {
        console.log(chalk.yellow(
            "Alloy configuration property set:\n" + property,
            "=", value));
        process.exit();
      }, onWriteError);
  });
}

/**
 * Adds a value to the given list property.
 */
function addToProperty(): void {
  processedCommand = true;
  let property: string = commander.args[0];
  let value: string = commander.args[1];

  // Show usage if there no property or value was specified.
  if (commander.args.length < 2 || typeof property !== "string"
      || typeof value !== "string") {
    commander.help();
  }

  getConfigAndApply(config => {
    // Check that the specified property is valid.
    checkProperty(property);

    // Check that the specified property is valid and is a list.
    try {
      Properties.validateList(property);
    } catch (e) {
      console.error(chalk.red("alloy: " + e.message));
      process.exit();
    }

    config.add(property, value);
    config.write().then(
      config => {
        console.log(chalk.yellow(
            "Alloy configuration property updated:\n" + property,
            "=", JSON.stringify(config.getList(property), null, 2)));
        process.exit();
      }, onWriteError);
  });
}

/**
 * Deletes the given property.
 */
function deleteProperty(): void {
  processedCommand = true;
  let property: string = commander.args[0];

  // Show usage if there no property was specified.
  if (!commander.args.length || typeof property !== "string") {
    commander.help();
  }

  getConfigAndApply(config => {
    // Check that the specified property is valid.
    checkProperty(property);

    if (!config.isConfigured(property)) {
      console.error(chalk.yellow(`alloy: property '${property}' is not set.`));
      process.exit();
    }

    let value = config.getConfig()[property];
    config.delete(property);
    config.write().then(
      config => {
        console.log(chalk.yellow("Deleted property:", property, "=",
            JSON.stringify(value, null, 2)));
        process.exit();
      }, onWriteError);
  });
}

/**
 * Removes a value from the given list property.
 */
function removeFromProperty(): void {
  processedCommand = true;
  let property: string = commander.args[0];
  let value: string = commander.args[1];

  // Show usage if there no property or value was specified.
  if (commander.args.length < 2 || typeof property !== "string"
      || typeof value !== "string") {
    commander.help();
  }

  getConfigAndApply(config => {
    // Check that the specified property is valid.
    checkProperty(property);

    // Check that the specified property is valid and is a list.
    try {
      Properties.validateList(property);
    } catch (e) {
      console.error(chalk.red("alloy: " + e.message));
      process.exit();
    }

    config.remove(property, value);
    config.write().then(
      config => {
        console.log(chalk.yellow(
            "Alloy configuration property updated:\n" + property,
            "=", JSON.stringify(config.getList(property), null, 2)));
        process.exit();
      }, onWriteError);
  });
}

/**
 * Retrieves the current configuration from the .alloy config file and applies
 * the given callback.
 * Aborts with an error message if no configuration is found.
 */
function getConfigAndApply(callback: (config: FileConfig) => void): void {
  new FileConfig(process.cwd()).read().then(
    config => {
      callback(config);
    },
    err => {
      if (err.errno === -2) {
        console.error(chalk.red(
            `alloy: Alloy is not configured. See "alloy init --help".`));
      } else {
        // Got an error other than ENOENT (file not found).
        console.error(err.toString());
        console.error(chalk.red("alloy: error reading Alloy configuration."));
      }
      process.exit();
    }
  );
}

function onWriteError(err: Error) {
  console.error(err.toString());
  console.error(chalk.red("alloy: error writing Alloy configuration."));
  process.exit();
}

/**
 * Checks that the given property name is valid, otherwise prints an error
 * message and aborts the script.
 */
function checkProperty(property: string): void {
  try {
    Properties.validate(property);
  } catch (e) {
    console.error(chalk.red("alloy: " + e.message));
    process.exit();
  }
}
