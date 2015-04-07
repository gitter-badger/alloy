# Alloy
Get the power of scripting back with ES6 modules, instant delta builds, sensible defaults, and no build scripts. Alloy is the anti-build system.

## Alloy's Principles
In general, we want to be the Git of compile-to JavaScript build systems: fast, simple, useful, and reliable.
* Simple (stateless cli, no BS; like Git)
* Instant (really, really fast delta builds)
* Polyglot (any language that targets the web or node)
* Made with Web Components in mind
* Optimized for massive projects (works with thousands of files and hundreds of lines of code)
* Free and Open Source (MIT License) (better than Git :) )

## How does Alloy compare with other Build Systems?
- Gulp, Brunch, Grunt, and other build systems are too slow, difficult to setup, and generally not optimizable for Web Component projects.
- Vulcanize (Polymer) is not fast enough for development, requires the use of HTML Import syntax (combining HTML with script), and doesn't work well with other compiled languages (TypeScript, ES6, Coffeescript, etc).
- Alloy can use Vulcanize for final production builds (minification, etc).


## Using Alloy
#### Getting Started
** Note: Alloy is not yet released and has limited functionality. **
- To build and install Alloy from the root of the repo:
``$ npm install -g``
- To use Alloy `$ alloy [command]`

#### API
[Alloy API Design Document (draft)](https://www.makenotion.com/IuozGZXxcVGZG)

## Building Alloy

Alloy is a tiny application written in ES6 with TypeScript type annotations and interfaces, it only requires compilation by the [TypeScript compiler](https://github.com/microsoft/typescript) to find any errors and completely build the project.


##### Pre-requirements
1. Install TypeScript v.1.5.0-alpha or higher: `$ npm install -g typescript`
2. Install the TypeScript Definitions manager for DefinitelyTyped: `$ npm install -g tsd`

##### Compiling

**It's highly recommended that you use the [Atom TypeStrong](https://atom.io/packages/atom-typescript) package for TypeScript or Visual Studio 2013+ to automatically build Alloy and find type errors!**

- Building Alloy Manually
  - To build once (with sourcemaps)
	- `$ tsc --sourcemap`
  - Build and watch for changes (with sourcemaps)
	- `$ tsc --watch --sourcemap`

## Contributing
- [Follow the Notion TypeScript Style Guide](https://www.makenotion.com/orKIlzU6nOIHe)
- *Community*:
  - [Sign the ICLA](https://docs.google.com/forms/d/1GBhRzcoMD-oSkDfitPEtEEsYzvpE680X2L5tjdGmMFg/viewform)
  - Submit a pull request.
- *Notion employee note*: Use production Notion for all open source projects (design documents, etc).
