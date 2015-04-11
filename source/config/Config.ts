import { arrify, path, ramda as R } from "../../vendor/npm";
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
  protected _config: Object;

  /**
   * @param config Optional config to load, this could be either a JSON string
   *     or a compatible object.
   */
  constructor(config?: string|Object) {
    if (config === undefined) {
      this._config = {};
      return;
    }
    if (typeof config === "string") {
      this._config = JSON.parse(config);
    } else {
      this._config = JSON.parse(JSON.stringify(config));
    }
    let dedupeIfList = (value) => {
      return Array.isArray(value) ? R.uniq(value) : value;
    }
    this._config = R.evolve(dedupeIfList, this._config);
    Config.validate(this._config);
  }

  /**
   * Return the list of source paths watched by this Alloy configuration.
   */
  public getSources(): string[] {
    return arrify(this.getList(Properties.SOURCES));
  }

  /**
   * Return the list of paths excluded from this Alloy configuration.
   */
  public getExcluded(): string[] {
    return arrify(this.getList(Properties.EXCLUDE));
  }

  /**
   * Returns true if a value has been set for the given property.
   */
  public isConfigured(property: string): boolean {
    Properties.validate(property);
    return R.has(property, this._config);
  }

  /**
   * Deletes the given property.
   */
  public delete(property: string): Config {
    Properties.validate(property);
    this._config = R.dissoc(property, this._config);
    return this;
  }

  /**
   * Returns the value of the given property, which could be a list or an array.
   */
  public get(property: string): string|string[] {
    Properties.validate(property);
    return R.clone(this._config[property]);
  }

  /**
   * Returns the value of the given string property.
   */
  public getString(property: string): string {
    Properties.validateString(property);
    return this._config[property];
  }

  /**
   * Returns the value of the given property that is configured as a
   * list of strings.
   */
  public getList(property: string): string[] {
    Properties.validateList(property);
    return R.clone(this._config[property]);
  }

  /**
   * Sets a property to the given string value.
   */
  public setString(property: string, value: string): Config {
    Properties.validateString(property, value);
    this._config = R.assoc(property, value, this._config);
    return this;
  }

  /**
   * Sets a list property to the given array of strings.
   */
  public setList(property: string, value: string|string[]): Config {
    Properties.validateList(property, value);
    if (typeof value === "string") {
      this._config = R.assoc(property, JSON.parse(value), this._config);
    } else {
      this._config = R.assoc(property, R.clone(value), this._config);
    }
    return this;
  }

  /**
   * Returns true the given list property contains the specified value.
   */
  public contains(property: string, value: string): boolean {
    Properties.validateList(property);
    return R.has(property, this._config)
        && R.contains(value, this._config[property]);
  }

  /**
   * Adds a string value to the given list property.
   */
  public add(property: string, value: string): Config {
    Properties.validateList(property);
    let newArr = R.append(value, this._config[property]);
    this._config = R.assoc(property, R.uniq(newArr), this._config);
    return this;
  }

  /**
   * Removes a string value from a given list property.
   */
  public remove(property: string, value: string): Config {
    Properties.validateList(property);
    if (this.contains(property, value)) {
      let arr = this._config[property];
      arr = R.remove(R.indexOf(value, arr), 1, arr);
      this._config = R.assoc(property, arr, this._config);
    }
    return this;
  }

  /**
   * Returns an object representing this config.
   */
  public get config(): Object {
    return JSON.parse(this.toString());
  }

  /**
   * Returns a string representation of this configuration in formatted JSON.
   */
  public toString(): string {
    return JSON.stringify(this._config, undefined, 2);
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
