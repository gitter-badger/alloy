import { WatchData } from "types";
import { chalk, ipc } from "../../vendor/npm";
import * as _ from "lodash";
import BuildWatcher from "./BuildWatcher";
import Config from "../config/Config";
import Properties from "../config/Properties";
import ServiceUtils from "../service/ServiceUtils";


/**
 * Service for asynchronous task execution such as file watching and building,
 * as well as maintaining persistant state across Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Server {
  private watcher: BuildWatcher;

  constructor() {
    this.watcher = new BuildWatcher();
  }

  /**
   * Start Alloy service.
   */
  start(): void {
    console.info(chalk.yellow("Starting Alloy service..."));

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

    // TODO(joeloyj): Rewrite using new API.
    // Load alloy config and start watching files.
    // try {
    //   if (Config.hasConfig(process.cwd())) {
    //     let config: Config = new Config(process.cwd()).read();
    //     this.watcher.watch(config.getPaths(), process.cwd());
    //     this.watcher.unwatch(config.getExcluded(), process.cwd());
    //     if (config.isConfigured(Properties.BUILD_DIRECTORY)) {
    //       this.watcher.unwatch(
    //           [config.getString(Properties.BUILD_DIRECTORY)], process.cwd());
    //     }
    //   }
    // } catch (e) {
    //   console.error(e.toString());
    //   console.error(chalk.red("alloy: error reading Alloy configuration."));
    // }
  }

  /**
   * Stop Alloy service.
   */
  stop(): void {
    this.watcher.exit();
    ipc.server.broadcast("stopped");
    console.info(chalk.yellow("Alloy service stopped."));
    process.exit();
  }

  private onWatch(data: WatchData, socket): void {
    this.watcher.watch(data.paths, data.cwd);
    ipc.server.emit(socket, "watched");
  }

  private onUnwatch(data: WatchData, socket): void {
    this.watcher.unwatch(data.paths, data.cwd);
    ipc.server.emit(socket, "unwatched");
  }
}
