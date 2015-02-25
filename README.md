# json library

A range of utility modules and functions to work with json or js objects

currently includes

- [json **pointer**]("https://github.com/sagold/json-library/tree/master/lib/pointer") implementation `pointer.get` and `pointer.set`, which creates objects on its path
- [json **query**]("https://github.com/sagold/json-library/tree/master/lib/query") a json pointer supporting glob-pattern `#/usr/**/*/passphrase`, filters
`#/input/*?valid:true` and simple regular expressions `#/input/{name-.*}/id`
- [json **relation**]("https://github.com/sagold/json-library/tree/master/lib/relation"), a relationship definition and utilities to setup and deconstruct relationships
between objects


For an up-to-date documentation refer to the [unit tests here]("https://github.com/sagold/json-library/tree/master/test/unit").


## Contents

- [Installation](Installation)
- [Usage](Usage)
- [Why](Why)
	- [JsonPointer](JsonPointer)
	- [JsonQuery](JsonQuery)
	- [JsonRelation](JsonRelation)


## Installation

### bower

`bower install json-library`

will install `bower_components/json-library`, where by default `/dist/JsonLibrary.min.js` will be loaded. This includes the complete json-library package, which is exposed to `window.JsonLibrary`, if not otherwise required. Additional versions included are

- `/dist/JsonLibrary.pointer.min.js` exposing `window.JsonPointer` only
- `/dist/JsonLibrary.query.min.js` exposing `window.JsonQuery` only
- `/dist/JsonLibrary.base.min.js` exposing `window.JsonLibrary`, excluding all _relation_ utilities

### npm

`npm install json-library`


## Usage

### pointer

```js
	var pointer = require("json-library").pointer;
	// get value of data at json pointer
	var value = pointer.get({"a":{"b"}:[{"id":"target"}]}, "#/a/b/0/id"); // target
	// add properties by pointer on data
	var object = pointer.set({}, "#/a/b/[0]/id", "target"); // {"a":{"b"}:[{"id":"target"}]}
	// join arguments to a valid json pointer
	var pointerToTarget = pointer.join("#/a", "#/b", "/0/", "target"); // #/a/b/0/target
```

For further details check [pointer README](https://github.com/sagold/json-library/tree/master/lib/pointer)


### query

```js
	var query = require("json-library").query;
	// call on each match of the query's matches
	query.query(data,
		"#/pointer/{regex.*}/**/*?property:hasValue||property:otherValue",
		function (value, key, parentObejct, jsonPointer) {
		});
	// return all json pointers of query matches
	var matches = query.query(data,
		"#/pointer/{^regex.*}/**/*?property:hasValue||property:otherValue",
		query.queryGet.POINTER
	);
```

For further details check [query README](https://github.com/sagold/json-library/tree/master/lib/query)


### json - circular dependencies

```js
	var json = require("json-library").json;
	// stringify data containing circular dependencies
	var circularJsonString = json.stringify(circularData, null, pretty);
	var data = json.parse(circularJsonString);
	JSON.stringify(data); // throws
```

### json

```js
	// too complex?
```

## Why

