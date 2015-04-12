/*

ir.ts

Created by Chris Prucha
© 2015 Notion Labs, Inc

Provide a kind of syntax tree for intermediate representation.

let ir = [
	{
		"type": "import_declaration",
		"module": {
			"type": "uri",
			"uri": "./foo"
		},
		"declarations": {
			"foo": {
				"property": null
			},
			"bar": {
				"property": "bar"
			}
		}
	},

	{
		"type": "unparsed",
		"text": "..."
	},

	{
		"type": "export_declaration",
		"default": {
			"text": "..."
		},
		properties: {
			"y": {
				"text": "..."
			},
			"x": {
				"text": "..."
			}
		}
	}
]

*/

// TODO(Chris): Create more rigid types
// once the schema is more defined.
interface import_declaration {
	type: string;
	module: Object;
	declarations: Object;
}

interface unparsed {
	type: string;
	text: string;
}

interface export_declaration {
	type: string;
	default: Object;
	properties: Object;
}

export interface irtree extends Array<import_declaration|unparsed|export_declaration> {}
