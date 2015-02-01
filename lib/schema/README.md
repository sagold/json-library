Converts a json schema by the given relationship.

# Why

> Convert a json schema into a user friendly data structure and the created data back into its normalized version.

A json schema for normalized data (flat, no duplication, etc) is not the ideal representation for user input.
Thus the json schema has to be modified in order to give users a more comprehensible ordering (i.e. for a json
editor). Still, the data should be stored in a normalized version for usage in data (simpler structure, no
hardcoded relationships, etc).

Creating a json schema for normalized data must not be duplicated if it could be transformed by relationships. The
resulting data-structure may then be converted back, by the same relationship, into its normalized data version.


# Usage example

given a json schema
```js
schema = {
	type: Object,
	properties: {
		parent: {
			type: Object
		},
		child: {}
	}
}
```

and a relationship definition
```js
rel = {
	"model": "#/parent",
	"type": "has_many",
	"references": "#/child",
	"alias": "children",
}
```

a new schema is build by `newSchema = schema.convert(schema, rel);` resulting in
```js
// newSchema:
{
	type: Object,
	properties: {
		parent: {
			type: Object,
			properties: {
				"children": {
					// adjusted by pivot-table, if any
					type: Array
				}
			}
		}
	}
}
```
