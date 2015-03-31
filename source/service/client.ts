import { SERVICE_ID } from "../lib/constants";
import { WatchData } from "types";
import { chalk, ipc } from "../../vendor/npm";

/**
 * Alloy service client. Uses unix sockets for IPC.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Client {
  constructor() {
    ipc.config.appspace = "alloy.";
    ipc.config.socketRoot = "/tmp/";
    ipc.config.id = "client";
    ipc.config.maxConnections = 100;
    ipc.config.retry = 500;
    ipc.config.stopRetrying = 10;
    ipc.config.silent = true;
  }

  /**
   * Watches the given paths for changes. If a given path is a directory,
   * all descendents of the directory will be watched. Changes to watched
   * files trigger automatic Alloy builds.
   */
  public watch(paths: string[], callback: () => void): void {
    ipc.connectTo(SERVICE_ID, (): void => {

      ipc.of[SERVICE_ID].on('connect', (): void => {
        let data: WatchData = {
          paths: paths,
          cwd: process.cwd()
        };
        ipc.of[SERVICE_ID].emit('watch', data);
      });

      ipc.of[SERVICE_ID].on('watched', (): void => {
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
    ipc.connectTo(SERVICE_ID, (): void => {

      ipc.of[SERVICE_ID].on('connect', (): void => {
        console.info(chalk.yellow("Stopping Alloy service..."));
        ipc.of[SERVICE_ID].emit('stop');
      });

      ipc.of[SERVICE_ID].on('stopped', (): void => {
        console.info(chalk.yellow("Alloy service stopped."));
        process.exit();
      });
    });
  }
}
