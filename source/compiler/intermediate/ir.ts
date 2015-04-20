/*

ir.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide a kind of syntax tree for intermediate representation.

let ir = [
	// default and named imports
	{
		"type": "import_declaration",
		"module": {
			"type": "uri",
			"uri": "./foo"
		},
		"declarations": {
			"foo": {
				"property": "default"
			},
			"bar": {
				"property": "bar"
			},
			"baz": {
				"property": "quux"
			}
		}
	},

	// namespace import
	{
		"type": "import_declaration",
		"module": {
			"type": "uri",
			"uri": "./foo"
		},
		"declarations": {
			"foo": {
				"property": null
			}
		}
	},

	// Unparsed
	{
		"type": "unparsed",
		"text": "..."
	},

	// Named declaration export
	{
		"type": "export_declaration",
		"text": "..."  // code with export syntax removed.
		"declarations": {
			"foo": {
				"property": "foo"
			}
		}
	},

	// default export
	{
		"type": "export_declaration",
		// replace export default with assignment i.e. var __alloy_default = {expr}
		"text": "..."
		"declarations": {
			"default": {
				"property": "__alloy_default"
			}
		}
	},

	// namespace re-export
	{
		"type": "export_declaration",
		"declarations": null
		"module": {
			"type": "uri"
			"uri": "./foo"
		}
	}

	// selective re-exports
	{
		"type": "export_declaration",
		"declarations": {
			"foo": {
				"property": "bar"
			}
			"baz": {
				"property": "quux"
			}
		}
		"module": {
			"type": "uri"
			"uri": "./foo"
		}
	}

]

*/

export interface IRElement {
	type: string;
}

// TODO(Chris): Create more rigid types
// once the schema is more defined.
export interface import_declaration extends IRElement {
	type: string;
	module: Object;
	declarations: Object;
}

export interface unparsed extends IRElement {
	type: string;
	text: string;
}

export interface export_declaration extends IRElement {
	type: string;
	module: Object;
	declarations: Object;
	text: string;
}

export interface ir extends Array<IRElement> {}
