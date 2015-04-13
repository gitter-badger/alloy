import { FSWatcher } from "fs";
import { Process } from "types";
import { arrify, chalk, child_process, commander } from "../../vendor/npm";
import ServiceUtils from "../service/ServiceUtils";

/**
 * alloy-start.js
 *
 * Starts the Alloy service, which watches for file changes and triggers
   automatic building as configured.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Starts the Alloy service, which watches for file changes and triggers
  automatic building as configured.`;

commander
    .description(description)
    .option("-b, --background", "start Alloy service in background mode")
    .parse(process.argv);

// Show error message if there are additional arguments.
if (commander.args.length) {
  console.error("alloy: '" + commander.args[0] + "' is not an alloy-start " +
      "command. See 'alloy-start --help'.");
  process.exit();
}

// Start Alloy service if it is not running yet.
ServiceUtils.lookupService((results: Process[]): void => {
  if (results.length === 0) {
    if (commander.background) {
      console.info(chalk.yellow("Starting Alloy service in background..."));
      let service = child_process.spawn("node",
          arrify(ServiceUtils.getServiceExec()), {
            // TODO(joeloyj): Log to file.
            stdio: [ 'ignore', 'ignore', 'ignore' ]
          });
      service.unref();
    } else {
      child_process.fork(ServiceUtils.getServiceExec());
    }
  } else {
    console.error(chalk.red("Alloy service is already running."));
  }
});
