import { Promise } from "es6-promise";
import { chalk, path as sysPath } from "../../vendor/npm";
import * as fs from "fs"
import Config from "./Config";

/**
 * Model representing an Alloy configuration in the form an .alloy config file
 * stored on disk.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class FileConfig extends Config {
  // Filename for Alloy configurations.
  public static FILENAME = ".alloy";

  // Directory for which an .alloy config file should be loaded,
  // or where one should be created if it doesn't exist yet.
  private directory: string;

  // True if Alloy config was loaded via create() or read().
  private isLoaded: boolean;

  // Path of the .alloy config file, only populated after config is loaded.
  private _configPath: string;

  /**
   * @param directory the directory for which an .alloy config file should be
   *     loaded, or where one should be created if it doesn't exist yet.
   */
  constructor(directory: string) {
    this.directory = sysPath.normalize(directory);
    this._configPath = undefined;
    super();
  }

  /**
   * Creates an empty Alloy configuration for the current directory.
   * The resulting promise will be rejected if there is already a .alloy
   * configuration for the directory.
   */
  public create(): Promise<FileConfig> {
    return new Promise<FileConfig>((resolve, reject) => {
      FileConfig.hasConfig(this.directory)
          .then(hasConfig => {
            if (hasConfig) {
              reject(new Error("Alloy configuration already exists."));
              return;
            }
            this._config = {};
            this._configPath =
                sysPath.join(this.directory, FileConfig.FILENAME);
            this.isLoaded = true;
            this.write().then(config => resolve(config), err => reject(err));
          })
          .catch(err => reject(err));
    });
  }

  /**
   * Retrieves Alloy configuration associated with the current directory.
   * This is stored as a .alloy config file in the directory or any of its
   * ancestor directories.
   */
  public read(): Promise<FileConfig> {
    return new Promise<FileConfig>((resolve, reject) => {
      this.readRecursive(this.directory)
          .then(result => {
            this._config = result;
            this.isLoaded = true;
            resolve(this);
          })
          .catch(err => reject(err));
      });
  }

  /**
   * Writes the current configuration to the .alloy config file.
   */
  public write(): Promise<FileConfig> {
    if (!this.isLoaded) {
      return Promise.reject(new Error(
          "Failed to write alloy config -- must create or read config first."));
    }
    return new Promise<FileConfig>((resolve, reject) => {

    });
    return new Promise<FileConfig>((resolve, reject) => {
      if (this._config === undefined) {
        reject(new Error("Nothing to write."));
      }
      fs.writeFile(this._configPath, this.toString(), (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(this);
      });
    });
  }

  /**
   * Retrieves the path of the .alloy config file used by this configuration.
   */
  public get configPath(): string {
    return this._configPath;
  }

  /**
   * Retrieves the directory path where the .alloy config file used by this
   * configuration lives.
   */
  public get configDirectory(): string {
    return this._configPath === undefined
        ? undefined
        : this._configPath.substring(0, -1 * FileConfig.FILENAME.length - 1);
  }

  /**
   * Returns true if there is an Alloy configuration for the given directory,
   * meaning the directory or any of it's ancestor directories have a .alloy
   * config file.
   */
  public static hasConfig(directory: string): Promise<boolean> {
    directory = sysPath.normalize(directory);
    return new Promise<boolean>((resolve, reject) => {
      fs.stat(sysPath.join(directory, FileConfig.FILENAME), (err, stats) => {
        if (!err) {
          // Found the file.
          resolve(true);
          return;
        }

        // Got a file stat error.
        if (err.code !== "ENOENT") {
          // Got a stat error other than file not found.
          reject(err);
          return;
        }
        // File not found, we must go deeper (shallower, actually).
        if (directory === "/") {
          // Already at top level directory, meaning no config was found.
          resolve(false);
          return;
        }
        // Recurse on parent directory.
        this.hasConfig(sysPath.normalize(`${directory}/..`))
            .then(result => resolve(result))
            .catch(err => reject(err));
      });
    });
  }

  // Looks for the alloy config file by looking in the given directory and
  // recursively traverses up the directory tree until it is found.
  private readRecursive(directory: string): Promise<Object> {
    directory = sysPath.normalize(directory);
    let configPath: string = sysPath.join(directory, FileConfig.FILENAME);
    return new Promise<Object>((resolve, reject) => {
      fs.readFile(configPath, { encoding: "utf8" }, (err, data) => {
        if (err) {
          if (err.code !== "ENOENT") {
            // Got a stat error other than file not found.
            reject(err);
            return;
          }
          // File not found, we must go deeper (shallower, actually).
          if (directory === "/") {
            // Already at top level directory.
            reject(err);
            return;
          }
          // Recurse on parent directory.
          this.readRecursive(sysPath.normalize(`${directory}/..`))
              .then(result => resolve(result))
              .catch(err => reject(err));
        } else {
          try {
            this._configPath = configPath;
            if (directory !== this.directory) {
              console.info(chalk.yellow(
                  `Using Alloy configuration found in ${directory}.`));
            }
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }
}
