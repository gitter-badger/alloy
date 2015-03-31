/**
 * Shared type definitions for Alloy.
 *
 * @author Joel Ong (joelo@google.com)
 */
declare module "types" {

  export interface WatchData {
    paths: string[];
    cwd: string;
  }

  export interface Process {
    pid: string;
    command: string;
    arguments: string[];
    ppid: string;
  }
}
