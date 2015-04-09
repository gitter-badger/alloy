import { WatchData } from "types";
import { chalk, ipc } from "../../vendor/npm";
import * as _ from "lodash";
import Alloy from "../api/Alloy";
import FileConfig from "../config/FileConfig";
import ServiceUtils from "../service/ServiceUtils";


/**
 * Service for asynchronous task execution such as file watching and building,
 * as well as maintaining persistant state across Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Server {
  private alloy: Alloy;

  /**
   * Start Alloy service.
   */
  start(): void {
    console.info(chalk.yellow("Starting Alloy service..."));

    // Load alloy config and start watching files.
    this.alloy = new Alloy({}, process.cwd());
    let onError = (err) => {
      console.error(err.toString());
      console.error(chalk.red("alloy: error reading Alloy configuration."));
    }
    FileConfig.hasConfig(process.cwd()).then(
      hasConfig => {
        if (hasConfig) {
          new FileConfig(process.cwd()).read().then(
            config => {
              this.alloy.reconfigure(config);
              this.alloy.start();
            }, onError);
        }
      }, onError);

    // IPC configuration.
    _.extend(ipc.config, {
      appspace       : "alloy.",
      socketRoot     : "/tmp/",
      id             : ServiceUtils.SERVICE_ID,
      maxConnections : 100,
      retry          : 500,
      silent         : true
    });

    // Configure IPC endpoints.
    ipc.serve((): void => {
      ipc.server.on("stop", (): void => this.stop());
      ipc.server.on("watch",
          (data: WatchData, socket): void => this.onWatch(data, socket));
      ipc.server.on("unwatch",
          (data: WatchData, socket): void => this.onUnwatch(data, socket));
    });

    // Start IPC server.
    ipc.server.start();
  }

  /**
   * Stop Alloy service.
   */
  stop(): void {
    this.alloy.stop();
    ipc.server.broadcast("stopped");
    console.info(chalk.yellow("Alloy service stopped."));
    process.exit();
  }

  private onWatch(data: WatchData, socket): void {
    this.alloy.addSources(data.paths, data.cwd);
    ipc.server.emit(socket, "watched");
  }

  private onUnwatch(data: WatchData, socket): void {
    // TODO(joeloyj): Unwatch using Alloy#exclude.
    ipc.server.emit(socket, "unwatched");
  }
}
