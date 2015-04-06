import { chalk } from "../../vendor/npm";

/**
 * Defines Alloy configuration properties and provides basic utilities for
 * working with them.
 */
export class Properties {
  // Available properties.
  public static EXCLUDE: string = "exclude";
  public static PATHS: string = "paths";

  // Property type information.
  public static LIST_PROPERTIES: string[] = [
    Properties.EXCLUDE,
    Properties.PATHS
  ];
  public static STRING_PROPERTIES: string[] = [];

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
   */
  public static validate(property: string): void {
    if (!Properties.isValid(property)) {
      throw new Error(`"${property}" is not a valid configuration property.`);
    }
  }

  /**
   * Checks if the given property is a valid Alloy configuration property
   * whose value is a string, otherwise throws an error.
   */
  public static validateString(property: string): void {
    Properties.validate(property);
    if (!Properties.isString(property)) {
      throw new Error(
          `"${property}" is not a valid string configuration property.`);
    }
  }

  /**
   * Checks if the given property is a valid Alloy configuration property
   * whose value is a list of strings, otherwise throws an error.
   */
  public static validateList(property: string): void {
    Properties.validate(property);
    if (!Properties.isList(property)) {
      throw new Error(
          `"${property}" is not a valid list configuration property.`);
    }
  }
}
