import { path } from "../../vendor/npm";
import BuildWatcher from "../service/BuildWatcher";
import Config from "../config/Config";
import Properties from "../config/Properties";

/**
 * Enumeration of Alloy statuses.
 */
export enum Status {
  STOPPED,
  STARTED
}

/**
 * Alloy API.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Alloy {
  private config: Object;
  private cwd: string;
  private status: Status;
  private watcher: BuildWatcher;

  /**
   * @param config configuration to initialize this Alloy instance with,
   *     accepts a Config, Object, or JSON string.
   * @param cwd working directory to which source paths in the initial
   *     configuration are relative.
   */
  constructor(config: Config|Object|string, cwd: string) {
    this.cwd = path.normalize(cwd);
    this.status = Status.STOPPED;
    this.setConfig(config);
  }

  /**
   * Performs a build with the current Alloy configuration.
   */
  public build(): void {
    // TODO(joeloyj): Implement.
    throw new Error("Not implemented.");
  }

  /**
   * Reconfigures this Alloy instance with the given configuration.
   * Alloy will be restarted if it is already running.
   */
  public reconfigure(config: Config|Object|string): void {
    let isRunning: boolean = this.status == Status.STARTED;
    // Stop Alloy if it is running.
    if (isRunning) {
      this.stop();
    }

    // Reconfigure alloy.
    this.setConfig(config);

    // Restart Alloy if it was previously running.
    if (isRunning) {
      this.start();
    }
  }

  /**
   * Starts this Alloy instance, monitoring for file changes and triggering
   * automatic builds as configured.
   */
  public start(): void {
    if (!this.watcher) {
      this.watcher = new BuildWatcher();
    }
    this.status = Status.STARTED;
    let sources: string[] = this.config[Properties.SOURCES];
    let excluded: string[] = this.config[Properties.EXCLUDE];
    // Watch source paths.
    if (sources.length > 0) {
      this.watcher.watch(sources, this.cwd);
    }
    // Unwatch excluded paths.
    if (excluded.length > 0) {
      this.watcher.unwatch(excluded, this.cwd);
    }
    // Exclude build output directory from watched sources.
    if (this.config.hasOwnProperty(Properties.BUILD_DIRECTORY)) {
      this.watcher.unwatch(
          [this.config[Properties.BUILD_DIRECTORY]], this.cwd);
    }
  }

  /**
   * Stops this Alloy instance. Files will no longer be monitored for
   * automatic building.
   */
  public stop(): void {
    if (this.watcher) {
      this.watcher.exit();
      this.watcher = undefined;
    }
    this.status = Status.STOPPED;
  }

  /**
   * Adds the given paths to the list of sources monitored by this
   * Alloy instance.
   */
  public addSources(paths: string[], cwd?: string): void {
    // TODO(joeloyj): Reconcile logic here with BuildWatcher and Config.
    // Normalize working directory if provided.
    if (cwd !== undefined) {
      cwd = path.normalize(cwd);
    }
    let newConfig = new Config(this.config);
    for (let p of paths) {
      // Resolve path if the specified working directory is different from the
      // one initially provided for this Alloy instance.
      if (cwd !== undefined && cwd !== this.cwd) {
        p = path.resolve(cwd, p);
      }
      // Add path to config if it doesn't already exist.
      if (newConfig.getSources().indexOf(p) === -1) {
        newConfig.add(Properties.SOURCES, p);
      }
    }
    // Watch new paths and update the in memory config for this instance.
    this.watcher.watch(paths, cwd);
    this.setConfig(newConfig);
  }

  /**
   * Excludes the given paths from the list of sources monitored by this
   * Alloy instance.
   */
  public exclude(paths: string): void {
    // TODO(joeloyj): Implement.
    throw new Error("Not implemented.");
  }

  /**
   * Returns the configuration of this Alloy instance.
   */
  public getConfig(): Object {
    return this.config;
  }

  /**
   * Returns the status of this Alloy instance.
   */
  public getStatus(): Status {
    return this.status;
  }

  /**
   * Sets the configuration of this Alloy instance.
   *
   * @param config configuration to initialize this Alloy instance with,
   *     accepts a Config, Object, or JSON string.
   */
  private setConfig(config: string|Config|Object) {
    if (typeof config === "string") {
      this.config = JSON.parse(config)
    } else if (config instanceof Config) {
      this.config = config.getConfig();
    } else {
      this.config = config;
    }
  }
}
