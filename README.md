# alloy
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

## Setup & API

#### Building Alloy
Alloy is a tiny application written in ES6, it only requires a simple transpile and concatenation by [Babel](https://github.com/babel/babel) to build.

- Just build:
``$ babel ./source/ --out-file ./build/alloy.js --source-maps``

- Watch and build:
``$ babel ./source/ --watch --out-file ./build/alloy.js --source-maps``

#### API
[Alloy API Design Document](https://www.makenotion.com/IuozGZXxcVGZG)

## Contributing
- *Community*: Submit a pull request and we will follow up with a contributor agreement when the PR is accepted.
- *Notion employee note*: use production Notion for all open source projects (design documents, etc).