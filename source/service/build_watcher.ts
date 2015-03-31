import { chalk, child_process, chokidar, path } from "../../vendor/npm";

import _ =  require("lodash");
import fs = require("fs");

const BUILD_DEBOUNCE_MS = 50;

/**
 * Manages files that are being watched for automatic building via Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class BuildWatcher {
  private watcher: fs.FSWatcher;
  private watchList: string[];
  private isInitialized: boolean;
  private debouncedBuild: () => void;

  constructor() {
    this.isInitialized = false;
    this.watchList = [];
    this.debouncedBuild = _.debounce(this.build.bind(this), BUILD_DEBOUNCE_MS);
  }

  /**
   * Watches the given paths. If a given path is a directory,
   * all descendents of the directory will be watched.
   * Watching a file that is already watched results in a no-op.
   */
  public watch(paths: string[], cwd: string): void {
    if (!this.isInitialized) {
      this.initialize(paths, cwd);
    }

    for (let p of paths) {
      let resolvedPath: string = this.resolvePath(p, cwd);
      if (this.watchList.indexOf(resolvedPath) == -1) {
        this.watchList.push(resolvedPath);
        console.info("Watching path: ", resolvedPath);
      } else {
        console.info("Rewatching path: ", resolvedPath);
      }
      this.watcher.add(resolvedPath);
    }
  }

  /**
   * Unwatches the given paths. If a given path is a directory,
   * all descendents of the directory will be unwatched.
   * Unwatching a file that is not watched results in a no-op.
   */
  public unwatch(paths: string[], cwd: string): void {
    if (!this.isInitialized) {
      return;
    }

    for (let p of paths) {
      let resolvedPath: string = this.resolvePath(p, cwd);
      let index: number = this.watchList.indexOf(resolvedPath);
      if (index >= 0) {
        delete this.watchList[index];
      }
      console.info("Unwatching path: ", resolvedPath);
    }
    this.watcher.unwatch(paths);
  }

  /**
   * Stop watching for file changes.
   */
  public exit(): void {
    if (!this.isInitialized) {
      return;
    }

    console.info(chalk.yellow("Build watcher stopped."));
    this.watcher.close();
  }

  // TODO(joeloyj): Provide mechanism for ignoring files or only watching
  // a subset of them by regex or alloy configuration.
  /**
   * Initializes the watcher.
   */
  private initialize(paths: string[], cwd: string): void {
    if (this.isInitialized) {
      return;
    }

    // Use current working directory if paths not specified.
    if (!paths || paths.length == 0) {
      paths = [ cwd ];
    }
    this.watcher = chokidar
        .watch(paths, {
          ignoreInitial: true,
          persistent: true,
        })
        .on('error', this.onError.bind(this))
        .on('all', this.onChange.bind(this));

    paths = paths.map((p: string): string => this.resolvePath(p, cwd));
    for (let p of paths) {
      if (this.watchList.indexOf(p) == -1) {
        console.info("Watching path: ", p);
        this.watcher.add(p);
      }
    }

    this.isInitialized = true;
  }

  /**
   * Triggered when a file change happens.
   *
   * @param event One of the following chokidar events:
   *              add, addDir, change, unlink, unlinkDir.
   */
  private onChange(event: string, path: string): void {
    console.info("Path changed [path=" + path + ", eventType=" + event + "].");

    // Trigger a build using a debounced function to avoid triggering a large
    // number of builds when a large number of files are changes at once,
    // such as when a directory is renamed.
    this.debouncedBuild();
  }

  // TODO(joeloyj): Build from configuration.
  private build() {
    child_process.fork("./build/source/alloy-build");
  }

  private onError(error: string): void {
    console.error(chalk.red("Watcher error: ", error));
  }

  private resolvePath(pathSpec: string, cwd: string): string {
    return cwd ? path.resolve(pathSpec, cwd) : pathSpec;
  }
}
