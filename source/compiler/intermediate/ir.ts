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
	default: Object;
	properties: Object;
}

export interface ir extends Array<IRElement> {}
