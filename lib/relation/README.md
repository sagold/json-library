# Json Relation

This is a basic *json relationship* implementation following the minimal [specification]("./specification")

A json relationship is established by

```js
	var Relationship = require("json-library").relation.Relationship;
	var relation = new Relationship(data, relationshipDefinition);
```

The main function of a relationship is to

- *load* one or all related tupels specified in foreign keys or pivot table to its parent tupel
- *update* the pivot table or foreign keys of one or all tupels
- *unload* reverse one or all established relations


## Usage

The following example

```js
	var Relationship = require("json-library").relation.Relationship;

	var relation = new Relationship(data, "parent has_one:child through:parent_children as:workload");
	relation.loadAll();
```

will change the json object

```js
	{
		parent: {
			p_01: {},
			p_02: {},
		},
		child: {
			c_01: {id: "c_01"},
			c_02: {id: "c_02"}
		},
		parent_children: {
			p_01: ["c_02", "c_01"],
			p_01: ["c_01"]
		}
	}
```

to

```js
	{
		parent: {
			p_01: {
				workload: [
					{id: "c_02"},
					{id: "c_01"}
				]
			},
			p_02: {
				workload: [
					{id: "c_01"}
				]
			}
		...
```

For further details and examples check [createDefinitionObject](./createDefinitionObject.js) and the [unit tests
]("../../test/unit/relation/")


### Relationship Definition

A relationship object may be also created by: `"[model] [[type]:[related] [mapping]:[path] (as:[alias])]"`. Using
`createDefinitionObject(string)` a valid relationship Object is retrieved. For details see
[createDefinitionObject]("./createDefinitionObject.js")


