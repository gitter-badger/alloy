import { Promise } from "es6-promise";
import { path } from "../../vendor/npm";
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

  // Path of the .alloy config file.
  private configPath: string;

  /**
   * @param directory the directory for which an .alloy config file should be
   *     loaded, or where one should be created if it doesn't exist yet.
   */
  constructor(private directory: string) {
    super();
  }

  /**
   * Creates an empty Alloy configuration for the current directory.
   */
  public create(): Promise<FileConfig> {
    return new Promise<Config>((resolve, rejected) => {
      FileConfig.hasConfig(this.directory).then(
          hasConfig => {
            if (hasConfig) {
              rejected(new Error("Alloy configuration already exists."));
              return;
            }
            this.config = {};
            this.configPath = path.join(this.directory, FileConfig.FILENAME);
            this.write().then(config => resolve(config), err => rejected(err));
          },
          err => rejected(err));
    });
  }

  /**
   * Finds the .alloy config file and retrieves the current configuration.
   */
  public read(): Promise<FileConfig> {
    // TODO(joeloyj): Check all parent directories for config file.
    this.configPath = path.join(this.directory, FileConfig.FILENAME);
    return new Promise<Config>((resolve, rejected) => {
      fs.readFile(this.configPath, { encoding: "utf8" }, (err, data) => {
        if (err) {
          rejected(err);
        } else {
          this.config = JSON.parse(data);
          resolve(this);
        }
      });
    });
  }

  /**
   * Writes the current configuration to the .alloy config file.
   */
  public write(): Promise<FileConfig> {
    return new Promise<Config>((resolve, rejected) => {
      if (!this.config) {
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
   * Returns true if there is an Alloy configuration for the given directory.
   */
  public static hasConfig(directory: string): Promise<boolean> {
    // TODO(joeloyj): Check all parent directories for config file.
    return new Promise<boolean>((resolve, rejected) => {
      fs.stat(path.join(directory, FileConfig.FILENAME), (err, stats) => {
        if (err) {
          if (err.errno === -2) {
            resolve(false);
          }
          rejected(err);
        }
        resolve(true);
      });
    });
  }
}
