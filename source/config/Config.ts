import { path, ramda as R } from "../../vendor/npm";
import Properties from "../config/Properties";

const CONFIG_FILENAME = ".alloy";

/**
 * Model representing an Alloy configuration. Encapsulates functionality
 * for working with configurations.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Config {
  // Alloy configuration.
  protected config: Object;

  /**
   * @param config Optional config to load, this could be either a JSON string
   *     or a compatible object.
   */
  constructor(config?: string|Object) {
    if (config === undefined) {
      return;
    }
    if (typeof config === "string") {
      this.config = JSON.parse(config);
    } else {
      this.config = JSON.parse(JSON.stringify(config));
    }
    Config.validate(this.config);
  }

  /**
   * Return the list of source paths watched by this Alloy configuration.
   */
  public getSources(): string[] {
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
    return this.config !== undefined && R.has(property, this.config);
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
    return this.config[property].slice();
  }

  /**
   * Sets a property to the given string value.
   */
  public setString(property: string, value: string): Config {
    Properties.validateString(property, value);
    if (this.config === undefined) {
      this.config = {};
    }
    this.config[property] = value;
    return this;
  }

  /**
   * Sets a list property to the given array of strings.
   */
  public setList(property: string, value: string|string[]): Config {
    Properties.validateList(property, value);
    if (this.config === undefined) {
      this.config = {};
    }
    if (typeof value === "string") {
      this.config[property] = JSON.parse(value);
    } else {
      this.config[property] = value.slice();
    }
    return this;
  }

  /**
   * Returns true the given list property contains the specified value.
   */
  public contains(property: string, value: string): boolean {
    Properties.validateList(property);
    if (!this.isConfigured(property)) {
      return false;
    }
    return R.contains(value, this.config[property]);
  }

  /**
   * Adds a string value to the given list property.
   */
  public add(property: string, value: string): Config {
    Properties.validateList(property);
    if (this.config === undefined) {
      this.config = {};
    }
    if (!this.isConfigured(property)) {
      this.config[property] = [];
    }
    if (!this.contains(property, value)) {
      this.config[property].push(value);
    }
    return this;
  }

  /**
   * Removes a string value from a given list property.
   */
  public remove(property: string, value: string): Config {
    Properties.validateList(property);
    if (this.contains(property, value)) {
      let arr = this.config[property];
      this.config[property] = R.remove(R.indexOf(value, arr), 1, arr);
    }
    return this;
  }

  /**
   * Deletes the given property.
   */
  public delete(property: string): Config {
    Properties.validate(property);
    if (this.isConfigured(property)) {
      delete this.config[property];
    }
    return this;
  }

  /**
   * Returns an object representing this config.
   */
  public getConfig(): Object {
    return JSON.parse(this.toString());
  }

  /**
   * Returns a string representation of this configuration in formatted JSON.
   */
  public toString(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Validates the given Alloy configuration.
   */
  public static validate(
      config: string|Object, onError?: (err: Error) => void) {
    let configObj: Object;
    if (typeof config === "string") {
      try {
        configObj = JSON.parse(config);
      } catch (e) {
        if (onError) onError(e);
        else throw e;
      }
    } else {
      configObj = config;
    }

    try {
      for (let property of Object.keys(configObj)) {
        Properties.validate(configObj[property]);
      }
    } catch (e) {
      if (onError) onError(e);
      else throw e;
    }
  }
}
