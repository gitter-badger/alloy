import { WatchData } from "types";
import { chalk, ipc, ramda as R } from "../../vendor/npm";
import ServiceUtils from "../service/ServiceUtils";

/**
 * Alloy service client. Uses unix sockets for IPC.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Client {
  constructor() {
    ipc.config = R.merge(ipc.config, {
      appspace       : "alloy.",
      socketRoot     : "/tmp/",
      id             : "client",
      maxConnections : 100,
      retry          : 500,
      stopRetrying   : 10,
      silent         : true
    });
  }

  /**
   * Watches the given paths for changes. If a given path is a directory,
   * all descendents of the directory will be watched. Changes to watched
   * files trigger automatic Alloy builds.
   */
  public watch(paths: string[], callback: () => void): void {
    ipc.connectTo(ServiceUtils.SERVICE_ID, (): void => {

      ipc.of[ServiceUtils.SERVICE_ID].on("connect", (): void => {
        let data: WatchData = {
          paths: paths,
          directory: process.cwd()
        };
        ipc.of[ServiceUtils.SERVICE_ID].emit("watch", data);
      });

      ipc.of[ServiceUtils.SERVICE_ID].on("watched", (): void => {
        console.info(
            chalk.yellow("Alloy is now watching the following paths:", paths));
        callback();
      });
    });
  }

  /**
   * Stops Alloy service.
   */
  public stop(): void {
    ipc.connectTo(ServiceUtils.SERVICE_ID, (): void => {

      ipc.of[ServiceUtils.SERVICE_ID].on("connect", (): void => {
        console.info(chalk.yellow("Stopping Alloy service..."));
        ipc.of[ServiceUtils.SERVICE_ID].emit("stop");
      });

      ipc.of[ServiceUtils.SERVICE_ID].on("stopped", (): void => {
        console.info(chalk.yellow("Alloy service stopped."));
        process.exit();
      });
    });
  }
}
