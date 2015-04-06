import { chalk, fs, path } from "../../vendor/npm";

const CONFIG_FILENAME = ".alloy";
const CONFIG_PROPERTIES = ["paths", "exclude"];

/**
 * Encapsulates functionality for reading and writing to an Alloy
 * configuration file.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */
export class Config {
  // Alloy configuration parsed from the config file.
  private config: Object;
  private configPath: string;

  /**
   * Returns true if there is an Alloy configuration for the given directory.
   */
  public static hasConfig(directory: string): boolean {
    // TODO(joeloyj): Check all parent directories for config file.
    try {
      fs.statSync(path.join(directory, CONFIG_FILENAME));
      return true;
    } catch (e) {
      if (e.errno === -2) {
        return false;
      }
      throw e;
    }
  }

  /**
   * Checks if the given value is a valid Alloy configuration property,
   * otherwise throws an error.
   */
  public static checkValidProperty(property: string) {
    if (!this.isValidProperty(property)) {
      throw new Error(property + " is not a valid configuration property.");
    }
  }

  /**
   * Returns true if the given value is a valid Alloy configuration property.
   */
  public static isValidProperty(property: string): boolean {
    return CONFIG_PROPERTIES.indexOf(property) >= 0;
  }

  /**
   * Finds the .alloy config file and retrieves the current configuration.
   */
  public read(directory: string): Config {
    // TODO(joeloyj): Check all parent directories for config file.
    this.configPath = path.join(directory, CONFIG_FILENAME);
    this.config = JSON.parse(
        fs.readFileSync(this.configPath, { encoding: "utf8" }));
    return this;
  }

  /**
   * Writes the current configuration to the .alloy config file.
   */
  public write(): Config {
    if (!this.config) {
      throw new Error("Nothing to write.");
    }
    fs.writeFileSync(this.configPath, this.toString());
    return this;
  }

  /**
   * Returns true if a value has been set for the given property.
   */
  public isPropertyConfigured(property: string): boolean {
    Config.checkValidProperty(property);
    return this.config.hasOwnProperty(property);
  }

  /**
   * Returns the value of the given property.
   */
  public getProperty(property: string): string {
    Config.checkValidProperty(property);
    return this.config[property];
  }

  /**
   * Sets a property to a given value.
   */
  public setProperty(property: string, value: string): Config {
    Config.checkValidProperty(property);
    this.config[property] = value;
    return this;
  }

  /**
   * Deletes the given property.
   */
  public deleteProperty(property: string): Config {
    Config.checkValidProperty(property);
    if (this.config.hasOwnProperty(property)) {
      delete this.config[property];
    }
    return this;
  }

  /**
   * Returns an object representing this config.
   */
  public getConfig(): Object {
    return this.config;
  }

  /**
   * Returns a string representation of this configuration in formatted JSON.
   */
  public toString(): string {
    return JSON.stringify(this.config, null, 2);
  }
}
