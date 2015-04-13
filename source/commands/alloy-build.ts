import { chalk, commander, path } from "../../vendor/npm";
import Alloy from "../api/Alloy";
import FileConfig from "../config/FileConfig";

/**
 * alloy-build.js
 *
 * Build using Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Notion Labs, Inc
 * @copyright 2015 Google Inc
 */

const description: string =
`Builds files using the Alloy configuration for [directory].

  If [directory] is not specified, Alloy will default to the current working
  directory.`;

// TODO(joeloyj): Implement vulcanize and clean.
commander
    .usage("[options] [directory]")
    .description(description)
    .option("-v, --vulcanize",
        "run vulcanize, taking all proceeding tokens as arguments")
    .option("--clean", "removes build directory and rebuilds all files")
    .parse(process.argv);

let directory = process.cwd();
if (commander.args.length > 0) {
  // If a path was specified, use that instead.
  directory = commander.args[0];
}

// Lookup config file and build.
new FileConfig(directory)
    .read()
    .then(config => {
      new Alloy(config, config.configDirectory)
          .build()
          .catch(err => {
            console.error(chalk.red("alloy: " + err.message));
          });
    })
    .catch(err => {
      let message: string;
      if (err.code === "ENOENT") { // File not found.
        if (commander.args.length) {
          message = "Specified directory target does not have an Alloy "
              + "configuration: " + directory;
        } else {
          message = `Alloy is not configured. See "alloy init --help".`;
        }
      } else {
        console.error(err.toString());
        message = "Error reading Alloy configuration.";
      }
      console.error(chalk.red(`alloy: ${message}`));
      process.exit();
    });
