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
- Vulcanize (polymer) is too slow, requires the use of html import syntax (combining HTML with script), and doesn't work with other compiled languages (TypeScript, ES6, Coffeescript, etc).

## Design Documentation
[Alloy Design Document](https://www.makenotion.com/ElV9Qe54jjs81)

## Using Alloy
#### Getting Started
- To install Alloy from the root of the repo:
``$ npm install -g``
- To use Alloy type `$ alloy some_command`

#### API
[Alloy API Design Document](https://www.makenotion.com/IuozGZXxcVGZG)

## Building Alloy

Alloy is a tiny application written in ES6 with Typescript annotations, it only requires a simple transpile and concatenation by [Typescript](https://github.com/microsoft/typescript) to build and see type errors.


##### Pre-requirements
- Install Typescript v.1.5.0 or higher (not on NPM yet)
	1. Install Typescript globally with `$ npm install -g typescript`
	2. [Clone the TS1.5/Angular 2 Demo repo](https://github.com/Microsoft/ngconf2015demo)
	3. Navigate to the Typescript shell binary path `cd /usr/local/lib/node_modules/typescript/bin/`
	4. Copy all `/tsc/` files from the demo repo to the bin folder above.
	5. Check that Typescript is now v.1.5.0.0 by doing `$ tsc -v`.

- Install the Typescript Definitions manager for DefinitelyTyped.
	1. `$ npm install -g tsd`

##### Building

- From the project root, start the Typescript compiler with `$ tsc `.

- Or to build once (with sourcemaps)
	- `$ tsc --sourcemap`

- Build and watch for changes (with sourcemaps)
	- `$ tsc --watch --sourcemap`

## Contributing
- *Community*: Submit a pull request and we will follow up with a contributor agreement when the PR is accepted.
- *Notion employee note*: use production Notion for all open source projects (design documents, etc).