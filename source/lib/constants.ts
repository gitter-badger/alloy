import { chalk, package_json } from "../../vendor/npm";

/**
 * Constants shared across Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */

export const BANNER = chalk.yellow(`
            __ __
     ___ _ / // /__  __ __
   / _  // // // _ \\/ // /    Alloy v${package_json.version}
   \\_,_//_//_/ \\___/\\_, /     ES6 Modules for Polyglot Web Components
                   /___/`);

export const SERVICE_ID = "alloy_ipc_service";
