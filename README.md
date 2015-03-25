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

Alloy is a tiny application written in ES6 with Facebook Flow, it only requires a simple transpile and concatenation by [Babel](https://github.com/babel/babel) to build. If you wish to modify Alloy, install Flow to see type errors.


##### Pre-requirements
- Install Flow v.0.7.0 or higher (not on NPM)
	- [Download the latest release](https://github.com/facebook/flow/releases)
	- Add the flow binary to your PATH.

- Install Babel globally:
``$ npm install babel -g``

##### Building

- From the project root, start Flow for type checking with `$ flow `.
	- *By default, you must type `$ flow` to typecheck after making a change, a Flow IDE plugin is highly recommended!*

- Build once
	- `$ babel ./source/ --out-dir ./build/ --source-maps`

- Watch and build
	- `$ babel ./source/ --watch --out-dir ./build/ --source-maps`

## Contributing
- *Community*: Submit a pull request and we will follow up with a contributor agreement when the PR is accepted.
- *Notion employee note*: use production Notion for all open source projects (design documents, etc).