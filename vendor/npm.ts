/*

npm.ts
Use NPM modules with ES6 module syntax in TypeScript.

NOTE(Chris): This file should be deprecated when TypeScript
and TypeStrong no longer throw errors when importing NPM modules.

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

export let chalk         = require("chalk")
export let child_process = require('child_process')
export let chokidar      = require("chokidar")
export let commander     = require("commander")
export let fs            = require("fs")
export let ipc           = require("node-ipc")
export let path          = require("path")
export let ps            = require("ps-node")
export let package_json  = require("../../package.json")
