import { chalk, fs, path } from "../../vendor/npm";
import Properties from "../lib/properties";

const CONFIG_FILENAME = ".alloy";

/**
 * Encapsulates functionality for reading and writing to an Alloy
 * configuration file.
 *
 * @author Joel Ong (joelo@google.com)
 * @copyright 2015 Google Inc
 */
export default class Config {
  // Alloy configuration parsed from the config file.
  // TODO(joeloyj): Use a map instead and convert to JSON when writing to disk.
  private config: Object;
  private configPath: string;

  constructor(private directory: string) {}

  /**
   * Creates an alloy config for the current directory.
   */
  public create(): Config {
    if (Config.hasConfig(this.directory)) {
      throw new Error("Alloy configuration already exists.");
    }
    this.config = {};
    this.configPath = path.join(this.directory, CONFIG_FILENAME);
    return this;
  }

  /**
   * Finds the .alloy config file and retrieves the current configuration.
   */
  public read(): Config {
    // TODO(joeloyj): Check all parent directories for config file.
    this.configPath = path.join(this.directory, CONFIG_FILENAME);
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
   * Return the list of paths watched by this Alloy configuration.
   */
  public getPaths(): string[] {
    if (this.isConfigured(Properties.SOURCES)) {
      return this.getList(Properties.SOURCES);
    } else {
      return [];
    }
  }

  /**
   * Return the list of paths excluded from this Alloy configuration.
   */
  public getExcluded(): string[] {
    if (this.isConfigured(Properties.EXCLUDE)) {
      return this.getList(Properties.EXCLUDE);
    } else {
      return [];
    }
  }

  /**
   * Returns true if a value has been set for the given property.
   */
  public isConfigured(property: string): boolean {
    Properties.validate(property);
    return this.config.hasOwnProperty(property);
  }

  /**
   * Returns the value of the given string property.
   */
  public getString(property: string): string {
    Properties.validateString(property);
    return this.config[property];
  }

  /**
   * Returns the value of the given property that is configured as a
   * list of strings.
   */
  public getList(property: string): string[] {
    Properties.validateList(property);

    return this.config[property];
  }

  /**
   * Sets a property to the given string value.
   */
  public setString(property: string, value: string): Config {
    Properties.validateString(property);
    if (!this.config) {
      this.config = {};
    }
    this.config[property] = value;
    return this;
  }

  /**
   * Sets a list property to the given array of strings.
   */
  public setList(property: string, value: string[]): Config {
    Properties.validateList(property);
    if (!this.config) {
      this.config = {};
    }
    this.config[property] = value;
    return this;
  }

  /**
   * Returns true the given list property contains the specified value.
   */
  public contains(property: string, value: string): boolean {
    Properties.validateList(property);
    if (!this.config || !this.config.hasOwnProperty(property)) {
      return false;
    }
    return this.config[property].indexOf(value) >= 0;
  }

  /**
   * Adds a string value to the given list property.
   */
  public add(property: string, value: string): Config {
    Properties.validateList(property);
    if (!this.config) {
      this.config = {};
    }
    if (!this.config.hasOwnProperty(property)) {
      this.config[property] = [];
    }
    if (!this.contains(property, value)) {
      this.config[property].push(value);
    }
    return this;
  }

  /**
   * Deletes the given property.
   */
  public delete(property: string): Config {
    Properties.validate(property);
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
}
