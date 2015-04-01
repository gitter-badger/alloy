# Alloy
A Polyglot (any language) HTML Imports-based Module System for Web Components that Builds Instantly.

## Alloy's Five Principles
* Simple
* Instant (really, really fast)
* Polyglot (any language)
* Optimized for massive Web Component projects
* Free and Open Source (MIT License)

## How does Alloy compare with other Build Systems?
- Gulp, Brunch, Grunt, and other build systems are too slow, difficult to setup, and generally not optimizable for Web Component projects.
- Vulcanize (polymer) is not fast enough for development, requires the use of html import syntax (combining HTML with script), and doesn't work well with other compiled languages (TypeScript, ES6, Coffeescript, etc).

## Design Documentation
[Alloy Design Document (draft)](https://www.makenotion.com/ElV9Qe54jjs81)


## Using Alloy
#### Getting Started
- To install Alloy from the root of the repo:
``$ npm install -g``
- To use Alloy `$ alloy some_command`

#### API
[Alloy API Design Document (draft)](https://www.makenotion.com/IuozGZXxcVGZG)

## Building Alloy

Alloy is a tiny application written in ES6 with TypeScript type annotations and interfaces, it only requires a simple transpile by the [TypeScript compiler](https://github.com/microsoft/typescript) to find type errors and completely build the project.


##### Pre-requirements
- Install Typescript v.1.5.0 or higher (not on NPM yet)
	1. [Clone and build TypeScript 1.5.0 or higher](https://github.com/Microsoft/typescript)
	2. Install tsc globally by runnign `$ npm install -g` from the TypeScript directory root.
	3. Check that TypeScript is now v.1.5.0+ by doing `$ tsc -v`.


- Install the Typescript Definitions manager for DefinitelyTyped.
	1. `$ npm install -g tsd`

##### Compiling

**It's highly recommended that you use the [Atom TypeStrong](https://atom.io/packages/atom-typescript) package for TypeScript or Visual Studio 2013+ to automatically build and find type errors!**

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
- *Notion employee note*: use production Notion for all open source projects (design documents, etc).
