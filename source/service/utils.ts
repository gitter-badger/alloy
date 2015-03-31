import { Process } from "types";
import { chalk, ps } from "../../vendor/npm";

/**
 * Utilities for working with Alloy service.
 *
 * @author Joel Ong (joelo@google.com)
 */

/**
 * Performs a process lookup for Alloy service.
 */
export function lookupService(callback: (results: Process[]) => void) {
  ps.lookup({
      command: 'node',
      arguments: 'alloy-service'
    },
    (err: string, results: Process[]): void => {
      if (err) {
        throw new Error(err);
      }
      callback(results);
    });
}
