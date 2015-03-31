import { Process } from "types";
import { chalk, child_process, commander } from "../vendor/npm";
import { lookupService } from "./service/utils";
import Client from "./service/client";

/**
 * alloy-watch.js
 *
 * Watch files for automatic building via Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Notion Labs, Inc
 * @copyright 2015 Google Inc
 */

const description =
`Watches files given by [pathspec...], triggering an automatic build if there
  are any changes.

  If [pathspec...] is not specified, the current working directory will be
  watched instead. If any of [pathspec...] is directory, all descendents of
  the directory will be watched.`;

commander
    .usage("alloy-watch [pathspec...]")
    .description(description)
    .parse(process.argv);

let paths: string[] = commander.args;
if (paths.length == 0) {
  // If no paths specified, use the working directory.
  paths.push(process.cwd());
}

// Connect to Alloy service or start it if it is not already running.
lookupService((results: Process[]): void => {
  // Start Alloy service if it is not running yet.
  if (results.length == 0) {
    console.info(
        chalk.yellow("Alloy service is not running, starting service..."));
    child_process.fork("./build/source/alloy-service",
        ["start"].concat(commander.args));
    return;
  }

  let paths: string[] = commander.args;
  if (paths.length == 0) {
    // If no paths specified, use the working directory.
    paths.push(process.cwd());
  }

  // Send message to existing Alloy service to watch the given paths.
  new Client().watch(paths, () => process.exit());
});
