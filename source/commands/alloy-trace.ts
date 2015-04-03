import { chalk, commander } from "../../vendor/npm";

/**
 * alloy-trace.js
 *
 * Alloy utility for tracing file dependencies.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */

const description: string =
`Utility for tracing module dependencies for a given file.

  Displays all dependents, consumers, and cycles for a given file
  that are within N degrees of separation. N=3 by default.`;

commander
    .usage("[options] file")
    .description(description)
    .option("-n, -d, --degrees", "number of degrees to display (default=3)")
    .parse(process.argv)

// Output help by if no file was specified.
if (!commander.args.length) {
  commander.help();
}

let degrees: number = commander.degrees || 3;
console.info(chalk.yellow(
    `Tracing dependencies within ${degrees} of ${commander.args[0]}`));

// TODO(joeloyj): Implement.
console.error(chalk.red("Not implemented."));
