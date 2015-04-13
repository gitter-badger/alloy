import { Process } from "types";
import { chalk, path, ps } from "../../vendor/npm";

/**
 * Utilities for working with Alloy service.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class ServiceUtils {
  public static SERVICE_ID: string = "alloy_ipc_service";

  /**
   * Performs a process lookup for Alloy service.
   */
  public static lookupService(callback: (results: Process[]) => void) {
    ps.lookup({
        command: "node",
        arguments: "alloy-service"
      },
      (err: string, results: Process[]): void => {
        if (err) {
          throw new Error(err);
        }
        callback(results);
      });
  }

  /**
   * Returns the executable path for Alloy service.
   */
  public static getServiceExec(): string {
    return `${path.dirname(process.argv[1])}/alloy-service`;
  }
}
