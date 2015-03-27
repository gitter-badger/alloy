/*

npm.ts
Use NPM modules with ES6 module syntax in TypeScript.

NOTE(Chris): This file should be deprecated when TypeScript
and TypeStrong no longer throw errors when importing NPM modules.

Created by Chris Prucha
© 2015 Notion Labs, Inc

*/

export let chalk     = require("chalk")
export let commander = require("commander")
export let package   = require("../../package.json")
