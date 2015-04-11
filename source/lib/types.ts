/**
 * Shared type definitions for Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 * @author Chris Prucha (chris@makenotion.com)
 */

declare module "types" {
  export interface WatchData {
    paths: string[];
    directory: string;
  }

  export interface Process {
    pid: string;
    command: string;
    arguments: string[];
    ppid: string;
  }
}
