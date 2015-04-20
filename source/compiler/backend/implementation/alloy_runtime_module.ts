/*

alloy_runtime_module.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Generate alloy runtime module code (commonjs with promises) from an ast.

// ES5.1
var foo;
var bar;
(function (foo, bar) {
	var module = alloy.require("./foo");
	foo = module;
	bar = module.bar;
}(foo, bar));

alloy.export({
  name: string,
  exported: any,
  default: boolean,
  type: string (uri, etc)
  uri: string
});

*/

throw new Error("Unimplemented");
