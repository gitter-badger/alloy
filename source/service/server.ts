import { SERVICE_ID } from "../lib/constants";
import { WatchData } from "types";
import { chalk, ipc } from "../../vendor/npm";
import BuildWatcher from "./build_watcher";

import _ = require("lodash");

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

    _.extend(ipc.config, {
      appspace       : "alloy.",
      socketRoot     : "/tmp/",
      id             : SERVICE_ID,
      maxConnections : 100,
      retry          : 500,
      silent         : true
    });

    ipc.serve((): void => {
      ipc.server.on("stop", (): void => this.stop());
      ipc.server.on("watch",
          (data: WatchData, socket): void => this.onWatch(data, socket));
      ipc.server.on("unwatch",
          (data: WatchData, socket): void => this.onUnwatch(data, socket));
    });
    ipc.server.start();
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
