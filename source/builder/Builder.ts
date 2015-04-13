import { Promise } from "es6-promise";
import { chalk } from "../../vendor/npm";
import Config from "../config/Config";

/**
 * Encapsulates Alloy build logic.
 *
 * @author Joel Ong (joelo@google.com)
 */
export default class Builder {
  private isBuilding: boolean;

  constructor(private _config: Config) {
    this.isBuilding = false;
  }

  /**
   * Builds using the Alloy configuration for this builder.
   */
  public build(): Promise<void> {
    if (this.isBuilding) {
      return Promise.reject(
          new Error("Failed to build -- a previous build is in progress."));
    }
    this.isBuilding = true;
    console.info(chalk.yellow("Building using Alloy..."));

    return new Promise<void>((resolve, reject) => {
      // TODO(joeloyj): Implement. Timeout here for testing purposes.
      setTimeout(() => {
        this.isBuilding = false;
        console.error(chalk.red("Not implemented."));
        console.info(chalk.yellow("Build successful!"));
        resolve();
      }, 1000);
    });
  }

  /**
   * Sets the Alloy configuration used by this builder.
   */
  public set config(config: Config) {
    this._config = config;
  }
}
