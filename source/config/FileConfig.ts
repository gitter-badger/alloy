import { Promise } from "es6-promise";
import { path as sysPath } from "../../vendor/npm";
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

  // Path of the .alloy config file.
  private configPath: string;

  /**
   * @param directory the directory for which an .alloy config file should be
   *     loaded, or where one should be created if it doesn't exist yet.
   */
  constructor(directory: string) {
    this.directory = sysPath.normalize(directory);
    this.configPath = undefined;
    super();
  }

  /**
   * Creates an empty Alloy configuration for the current directory.
   * The resulting promise will be rejected if there is already a .alloy
   * configuration for the directory.
   */
  public create(): Promise<FileConfig> {
    return new Promise<Config>((resolve, rejected) => {
      FileConfig.hasConfig(this.directory)
          .then(hasConfig => {
            if (hasConfig) {
              rejected(new Error("Alloy configuration already exists."));
              return;
            }
            this._config = {};
            this.configPath = sysPath.join(this.directory, FileConfig.FILENAME);
            this.write().then(config => resolve(config), err => rejected(err));
          })
          .catch(err => rejected(err));
    });
  }

  /**
   * Retrieves Alloy configuration associated with the current directory.
   * This is stored as a .alloy config file in the directory or any of its
   * ancestor directories.
   */
  public read(): Promise<FileConfig> {
    return new Promise<Config>((resolve, rejected) => {
      this.readRecursive(this.directory)
          .then((result) => {
            this._config = result;
            resolve(this);
          })
          .catch((err) => rejected(err));
      });
  }

  /**
   * Writes the current configuration to the .alloy config file.
   */
  public write(): Promise<FileConfig> {
    return new Promise<Config>((resolve, rejected) => {
      if (this._config === undefined) {
        rejected(new Error("Nothing to write."));
      }
      fs.writeFile(this.configPath, this.toString(), (err, data) => {
        if (err) {
          rejected(err);
        }
        resolve(this);
      });
    });
  }

  /**
   * Returns true if there is an Alloy configuration for the given directory,
   * meaning the directory or any of it's ancestor directories have a .alloy
   * config file.
   */
  public static hasConfig(directory: string): Promise<boolean> {
    directory = sysPath.normalize(directory);
    return new Promise<boolean>((resolve, rejected) => {
      fs.stat(sysPath.join(directory, FileConfig.FILENAME), (err, stats) => {
        if (!err) {
          // Found the file.
          resolve(true);
          return;
        }

        // Got a file stat error.
        if (err.code !== "ENOENT") {
          // Got a stat error other than file not found.
          rejected(err);
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
            .then((result) => resolve(result))
            .catch((err) => rejected(err));
      });
    });
  }

  // Looks for the alloy config file by looking in the given directory and
  // recursively traverses up the directory tree until it is found.
  private readRecursive(directory: string): Promise<Object> {
    directory = sysPath.normalize(directory);
    let configPath: string = sysPath.join(directory, FileConfig.FILENAME);
    return new Promise<Object>((resolve, rejected) => {
      fs.readFile(configPath, { encoding: "utf8" }, (err, data) => {
        if (err) {
          if (err.code !== "ENOENT") {
            // Got a stat error other than file not found.
            rejected(err);
            return;
          }
          // File not found, we must go deeper (shallower, actually).
          if (directory === "/") {
            // Already at top level directory.
            rejected(err);
            return;
          }
          // Recurse on parent directory.
          this.readRecursive(sysPath.normalize(`${directory}/..`))
              .then((result) => resolve(result))
              .catch((err) => rejected(err));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            rejected(e);
          }
        }
      });
    });
  }
}
