import { path as sysPath, ramda as R } from "../../vendor/npm";
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
  private _status: Status;
  private config: Config;
  private directory: string;
  private watcher: BuildWatcher;

  /**
   * @param config configuration to initialize this Alloy instance with,
   *     accepts a Config, Object, or JSON string.
   * @param directory the directory to which source paths in the initial
   *     configuration are relative.
   */
  constructor(config: Config|Object|string, directory: string) {
    this._status = Status.STOPPED;
    this.directory = sysPath.normalize(directory);
    this.watcher = undefined;
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
    let isRunning: boolean = this._status === Status.STARTED;

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
    if (this.watcher === undefined) {
      this.watcher = new BuildWatcher();
    }
    this._status = Status.STARTED;
    let sources: string[] = this.config.getSources();
    let excluded: string[] = this.config.getExcluded();

    // Watch source paths.
    if (sources.length > 0) {
      this.watcher.watch(sources, this.directory);
    }
    // Unwatch excluded paths.
    if (excluded.length > 0) {
      this.watcher.unwatch(excluded, this.directory);
    }
    // Exclude build output directory from watched sources.
    if (this.config.isConfigured(Properties.BUILD_DIRECTORY)) {
      let out =
          sysPath.normalize(this.config.getString(Properties.BUILD_DIRECTORY));
      this.watcher.unwatch([`${out}/**/*`], this.directory);
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
    this._status = Status.STOPPED;
  }

  /**
   * Adds the given paths to the list of sources monitored by this
   * Alloy instance.
   *
   * @param directory the directory to which given source paths are relative
   */
  public addSources(paths: string[], directory?: string): void {
    // TODO(joeloyj): Reconcile logic here with BuildWatcher and Config.
    // Normalize working directory if provided.
    if (directory !== undefined) {
      directory = sysPath.normalize(directory);
    }
    for (let p of paths) {
      // Resolve path if the specified working directory is different from the
      // one initially provided for this Alloy instance.
      if (directory !== undefined && directory !== this.directory) {
        p = sysPath.resolve(directory, p);
      }
      // Add path to config if it doesn't already exist.
      this.config.add(Properties.SOURCES, p);
    }
    // Watch new paths.
    this.watcher.watch(paths, directory);
  }

  /**
   * Excludes the given paths from the list of sources monitored by this
   * Alloy instance. Paths must either be fully specified, or a working
   * directory must be provided. Accepts anymatch-compatible paths.
   *
   * @see https://github.com/es128/anymatch
   * @param directory the directory to which given source paths are relative
   */
  public exclude(paths: string[], directory?: string): void {
    // TODO(joeloyj): Reconcile logic here with BuildWatcher and Config.
    // Normalize working directory if provided.
    if (directory !== undefined) {
      directory = sysPath.normalize(directory);
    }
    for (let p of paths) {
      // Resolve path if a working directory was specified.
      if (directory !== undefined) {
        p = sysPath.resolve(directory, p);
      }
      // Add excluded path to config if it doesn't already exist.
      this.config.add(Properties.EXCLUDE, p);
    }
    // Unwatch new paths.
    this.watcher.unwatch(paths, directory);
  }

  /**
   * Returns the configuration of this Alloy instance.
   */
  public getConfig(): Object {
    return this.config.config;
  }

  /**
   * Returns the status of this Alloy instance.
   */
  public get status(): Status {
    return this._status;
  }

  /**
   * Sets the configuration of this Alloy instance.
   *
   * @param config configuration to initialize this Alloy instance with,
   *     accepts a Config, Object, or JSON string.
   */
  private setConfig(config: string|Config|Object) {
    if (config instanceof Config) {
      this.config = config;
    } else {
      this.config = new Config(config);
    }
  }
}
