# Json Relation

A json relationship specification and implementation.


## Specification #v0.1

> A Json Relation defines a relationship of two Json Models

**Axiom** A relationship must be resolvable through selection only

**Korollar** the related Tupel must be given by its *primary key*

**Korollar** *pivot-tables* are uni-directional


### Json Model

> A *Json Model* (relation) is an object or array containing items (*tupels*) associated with a *primary key*. Each
*tupel* consists of tupel-properties (attributes).


### Tupel

> A *tupel* is direct child object within a *Json Model*

```js
// Model
{
	"primary key": tupel
}
```


### Primary Key

> A *primary key* is given as an object-property or array-index:

```js
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

### Pivot-Table

> A *pivot-table* is an object having *primary keys* as property names

```js
// Pivot for has_one relationships
{
	"pk_0": "fpk_0" // foreign primary key
}
// Pivot for has_many relationships
{
	"pk_0": ["fpk_0", "fpk_1"] // foreign primary keys
}
```

The value of a *primary key* within a *pivot-table* is refered as *foreign keyset*


### Relationship Definition

> A Relationship Object holds all neccessary information to retrieve a related object by selection

```
{
	"model": parentJsonModel,
	"references": relatedJsonModel,
	"type": ["has_one", "has_many"],
	"through": mappingObject
	"alias": propertyNameOfRelationship
}
```
