/**
 * Defines Alloy configuration properties and provides basic utilities for
 * working with them.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Properties {
  // Available properties.
  public static BUILD_DIRECTORY: string = "out";
  public static EXCLUDE: string = "exclude";
  public static SOURCES: string = "src";

  // Property type information.
  public static LIST_PROPERTIES: string[] = [
    Properties.EXCLUDE,
    Properties.SOURCES
  ];
  public static STRING_PROPERTIES: string[] = [
    Properties.BUILD_DIRECTORY
  ];

  /**
   * Returns true if the given value is a valid Alloy configuration property.
   */
  public static isValid(property: string): boolean {
    return Properties.isList(property) || Properties.isString(property);
  }

  /**
   * Returns true if the given property is a valid Alloy configuration property
   * whose value is a string.
   */
  public static isString(property: string): boolean {
    return Properties.STRING_PROPERTIES.indexOf(property) >= 0;
  }

  /**
   * Returns true if the given property is a valid Alloy configuration property
   * whose value is a list of strings.
   */
  public static isList(property: string): boolean {
    return Properties.LIST_PROPERTIES.indexOf(property) >= 0;
  }

  /**
   * Checks if the given string is a valid Alloy configuration property,
   * otherwise throws an error.
   * @param value Optional value on which to perform type validation.
   */
  public static validate(property: string, value?: any): void {
    if (!Properties.isValid(property)) {
      throw new Error(`"${property}" is not a valid configuration property.`);
    }
    if (value === undefined) {
      return;
    }
    if (Properties.isString(property)) {
      Properties.validateString(property, value);
    } else if (Properties.isList(property)) {
      Properties.validateList(property, value);
    }
  }

  /**
   * Checks if the given property is a valid Alloy configuration property
   * whose value is a string, otherwise throws an error.
   * @param value Optional value on which to perform type validation.
   */
  public static validateString(property: string, value?: any): void {
    Properties.validate(property);
    if (!Properties.isString(property)) {
      throw new Error(
          `"${property}" is not a valid string configuration property.`);
    }
    if (value !== undefined && typeof value !== "string") {
      throw new Error(
          `"${value}" is not a valid string value for property "${property}".`);
    }
  }

  /**
   * Checks if the given property is a valid Alloy configuration property
   * whose value is a list of strings, otherwise throws an error.
   * @param value Optional value on which to perform type validation.
   */
  public static validateList(property: string, value?: any): void {
    Properties.validate(property);
    if (!Properties.isList(property)) {
      throw new Error(
          `"${property}" is not a valid list configuration property.`);
    }
    if (value === undefined) {
      return;
    }
    let listErr = new Error(`'${value}' is not a valid list of strings for`
        + ` property "${property}."`);
    let parsedValue = value;
    if (typeof value === "string") {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        throw listErr;
      }
    }
    if (typeof parsedValue !== "object" || !Array.isArray(parsedValue)) {
      throw listErr;
    }
    for (let elem of parsedValue) {
      if (typeof elem !== "string") {
        throw new Error(
            `"${elem}" is not a valid string for property "${property}".`);
      }
    }
  }
}
