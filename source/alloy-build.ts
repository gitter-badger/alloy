import { chalk, commander } from "../vendor/npm";

/**
 * alloy-build.js
 *
 * Build using Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Notion Labs, Inc
 */

const description: string =
`Builds files given by [pathspec...].

  If [pathspec...] is not specified, the current working directory will be
  used instead. If any of [pathspec...] is a directory, all descendents of
  the directory will be built.`;

commander
    .usage("[options] [pathspec...]")
    .description(description)
    .parse(process.argv);

console.info(chalk.yellow("Building using Alloy..."));

// TODO(joeloyj): Implement build.
console.error(chalk.red("Not implemented."));
