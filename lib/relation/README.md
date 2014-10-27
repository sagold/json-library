# Json Relation

A json relationship specification and implementation.


## Specification #v0.1

> A Json Relation defines a relationship of two Json Models

**Axiom** A relationship must be resolvable through selection only

**Korollar** the related Tupel must be given by its primary_key

**Korollar** pivot-tables are uni-directional


### Json Model

> A Json Model (relation) is an object or array containing items (tupels) associated with a primary_key. Each tupel consists of tupel-properties (atttributes).

### primary_key

> A primary_key is given as an object-property or array-index:

```javascript
// Object-Model:
{
	// primary_key (entry) for following Tupel
	"entry": {
		// Attributes
		"name": "name of tupel"
	}
}
// Array-Model:
[
	// primary_key (0) for following Tupel
	{
		// Attributes
		"name": "name of tupel"
	}
]
```

### Relationship Object

> A Relationship Object holds all neccessary information to retrieve a related object by selection

```javascript
{
	"alias": <name>:optional, // defaults to <reference>
	"model": <json/pointer/to/model>,
	"foreign_key": <property-holding-references-pk>,
	"type": <"has_one" | "has_many" | "belongs_to">,
	"references": <json/pointer/to/target-model>,
	"through": <json/pointer/to/pivot-table>:optional
}
```



