# json library

A range of utility modules and functions to work with json or js objects.

currently includes

- [json **pointer**]("https://github.com/sagold/json-pointer") implementation `pointer.get` and
`pointer.set`, which creates objects on its path and `pointer.delete`, to remove a property or item

- [json **query**]("https://github.com/sagold/json-query") a json pointer supporting
glob-pattern `#/usr/**/*/passphrase`, filters `#/input/*?valid:true` and simple regular expressions
`#/input/{name-.*}/id`

- [json **relation**]("https://github.com/sagold/json-relationship"), a relationship definition and
utilities to setup and deconstruct relationships between objects


For an up-to-date documentation refer to corresponding unit tests in `*/test/unit/`


## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Why](#why)
	- [JsonPointer](#pointer)
	- [JsonQuery](#query)
	- [Json](#json)
	- [JsonRelation](#relation)


## Installation

### bower

`bower install json-library`

will install `bower_components/json-library`, where by default `/dist/JsonLibrary.min.js` will be loaded. This includes the complete json-library package, which is exposed to `window.JsonLibrary`, if not otherwise required. Additional versions included are

- `/dist/JsonLibrary.pointer.min.js` exposing `window.JsonPointer` only
- `/dist/JsonLibrary.query.min.js` exposing `window.JsonQuery` only
- `/dist/JsonLibrary.base.min.js` exposing `window.JsonLibrary`, excluding all _relation_ utilities

### npm

`npm install json-library`

you can also directly require separate modules with `require("json-libary/pointer")` and
`require("json-libary/query")`


## Usage

For a full API see [lib README](https://github.com/sagold/json-library/tree/master/lib) for an overview and its nested packages for details.


### pointer

```js
var pointer = require("json-library").pointer;
// get value of data at json pointer
var value = pointer.get({"a":{"b"}:[{"id":"target"}]}, "#/a/b/0/id"); // target
// add properties by pointer on data
var object = pointer.set({}, "#/a/b/[0]/id", "target"); // {"a":{"b"}:[{"id":"target"}]}
// delete properties or items
var object = pointer.delete({"a":{"b"}:[{"id":"target"}]}, "#/a/b/0"); // {"a":{"b"}:[]}
// join arguments to a valid json pointer
var pointerToTarget = pointer.join("#/a", "#/b", "/0/", "target"); // #/a/b/0/target
```

For further details check [pointer README](https://github.com/sagold/json-library/tree/master/lib/pointer)


### query

```js
var query = require("json-library").query;
// call on each match of the query's matches
query.run(data,
	"#/pointer/{regex.*}/**/*?property:hasValue||property:otherValue",
	function (value, key, parentObject, jsonPointer) {
	});
// return all json pointers of query matches
var matches = query.run(data,
	"#/pointer/{^regex.*}/**/*?property:hasValue||property:otherValue",
	query.get.POINTER
);
```

For further details and `query.get` and `query.delete` check
[query README](https://github.com/sagold/json-library/tree/master/lib/query).


### relationship

A json relationship defines `1:1`, `1:n` or `n:n` relationships between models (json values). This utility will work
non-destructibly on objects or may export transformed relation data. This is very useful for building different
relationships based on a single flat hierarchy (normalized data). Furthermore, relationships are useful for
transforming data. Some Details can be found in
[relation README](https://github.com/sagold/json-library/tree/master/lib/relation)

