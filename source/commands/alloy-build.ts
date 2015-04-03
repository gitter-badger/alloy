import { chalk, commander } from "../../vendor/npm";

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
`Builds files using the current Alloy configuration.

  If specified, [pathspec...] will be used instead of the current Alloy config.
  If no [pathspec...] or Alloy config is present, the current working directory
  will be used instead.

  If any of [pathspec...] is a directory, all descendents of the directory
  will be built.`;

commander
    .usage("[options] [pathspec...]")
    .description(description)
    .option("-v, --vulcanize",
        "run vulcanize, taking all proceeding tokens as arguments")
    .option("--clean", "removes build directory and rebuilds all files")
    .parse(process.argv);

console.info(chalk.yellow("Building using Alloy..."));

// TODO(joeloyj): Implement build.
console.error(chalk.red("Not implemented."));
