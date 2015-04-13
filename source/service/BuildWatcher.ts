import { chalk, child_process, chokidar, path as sysPath } from "../../vendor/npm";
import { FSWatcher } from "fs";
import * as _ from "lodash";
import Builder from "../builder/Builder";

const BUILD_DEBOUNCE_MS = 50;

/**
 * Manages files that are being watched for automatic building via Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class BuildWatcher {
  private watcher: FSWatcher;
  private watchList: Set<string>;
  private isInitialized: boolean;
  private debouncedBuild: () => void;

  constructor(private builder: Builder) {
    this.watcher = undefined;
    this.watchList = new Set();
    this.isInitialized = false;
    this.debouncedBuild = _.debounce(this.build.bind(this), BUILD_DEBOUNCE_MS);
  }

  /**
   * Watches the given paths. If a given path is a directory,
   * all descendents of the directory will be watched.
   * Watching a file that is already watched results in a no-op.
   *
   * @param directory the directory to which given source paths are relative
   */
  public watch(paths: string[], directory: string): void {
    if (!this.isInitialized) {
      this.initialize(paths, directory);
      return;
    }

    for (let path of paths) {
      let resolvedPath: string = this.resolvePath(directory, path);
      if (this.watchList.has(resolvedPath)) {
        console.info("Rewatching path: ", resolvedPath);
      } else {
        this.watchList.add(resolvedPath);
        console.info("Watching path: ", resolvedPath);
      }
      this.watcher.add(resolvedPath);
    }
  }

  /**
   * Unwatches the given paths. Unwatching a file that is not watched
   * results in a no-op. Accepts anymatch-compatible paths.
   *
   * @see https://github.com/es128/anymatch
   * @param directory the directory to which given source paths are relative
   */
  public unwatch(paths: string[], directory: string): void {
    if (!this.isInitialized) {
      return;
    }

    paths = paths.map((path) => this.resolvePath(directory, path));
    for (let path of paths) {
      this.watchList.delete(path);
      console.info("Unwatching path: ", path);
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

  /**
   * Initializes the watcher.
   */
  private initialize(paths: string[], directory: string): void {
    if (this.isInitialized) {
      return;
    }

    // Use current working directory if paths not specified.
    if (paths === undefined || paths.length === 0) {
      paths = [ directory ];
    }
    this.watcher = chokidar
        .watch(paths, {
          cwd: directory,
          ignoreInitial: true,
          persistent: true,
        })
        .on("error", this.onError.bind(this))
        .on("all", this.onChange.bind(this));

    paths = paths.map((path) => this.resolvePath(directory, path));
    for (let path of paths) {
      if (!this.watchList.has(path)) {
        console.info("Watching path: ", path);
        this.watcher.add(path);
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

  private build(): void {
    this.builder.build();
  }

  private onError(error: string): void {
    console.error(chalk.red("Watcher error: ", error));
  }

  private resolvePath(directory: string, pathSpec: string): string {
    return directory ? sysPath.resolve(directory, pathSpec) : pathSpec;
  }
}
