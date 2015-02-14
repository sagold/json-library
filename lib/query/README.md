# query


At first query acts like a normal **json-pointer** where its match is passed to the given callback function:

```js
	var query = require("query").query;
	var data = {
		"parent": {
			"child": {"id": "child-1"}
		}
	};
	query(data, "#/parent/child/id", function (value, object, key, jsonPointer) {
		// value = "child-1",
		// object = {"id": "child-1"}
		// key = "id"
		// jsonPointer = "#/parent/child/id"
	});
```


But query also supports **glob-patterns** with `*`:

```js
	var query = require("query").query;
	var data = {
		"parent": {
			"child": {"id": "child-1"}
		},
		"neighbour": {
			"child": {"id": "child-2"}
		}
	};
	query(data, "#/*/child/id", function (value, object, key, jsonPointer) {
		// will be called with value: "child-1" and "child-2"
	});
```

and **glob-patterns** with `**`:

```js
	var query = require("query").query;
	var data = {
		"parent": {
			"child": {"id": "child-1"}
		},
		"neighbour": {
			"child": {"id": "child-2"}
		}
	};
	query(data, "#/**/id", function (value, object, key, jsonPointer) {
		// will be called with value: "child-1" and "child-2"
	});
```

To **filter** the matched objects an object-query string may be appended on each single step:

```js
	var query = require("query").query;
	var data = {
		"parent": {
			"valid": true,
			"child": {"id": "child-1"}
		},
		"neighbour": {
			"valid": false,
			"child": {"id": "child-2"}
		}
	};
	query(data, "#/**?valid:true&&ignore:undefined/child", function (value, object, key, jsonPointer) {
		// will be called with value: {"id": "child-1"} only
	});
	// same result with
	query(data, "#/**?valid:!false/child", function (value, object, key, jsonPointer) { // ...
```

Properties may also be tested with **regular expression**, as long as **no '/'** is included:

```js
	var query = require("query").query;
	var data = {
		"albert": true,
		"alfred": true,
		"alfons": true
	};
	query(data, "#/{al[^b]}", function (value, object, key, jsonPointer) {
		// will be executed with values: alfred & alfons
	});
```


## queryGet

If you only require values or pointers, use queryGet to receive an Array as result:

```js
	var queryGet = require("query").queryGet;

	// default: queryGet.VALUES
	var arrayOfValues = queryGet(data, "#/**/id", queryGet.VALUE);
	// ["#/..", "#/..", ...]
	var arrayOfJsonPointers = queryGet(data, "#/**/id", queryGet.POINTER);
	// [arguments, arguments], where arguments = 0:value 1:object 2:key 3:jsonPointer
	var arrayOfAllFourArguments = queryGet(data, "#/**/id", queryGet.ALL);
```


## Examples

- `query(data, "#/**", callback);` will iterate over each value of the data object
- `query(data, "#/**/*", callback);` will iterate over each leaf in the data object
- `query(data, "#/**?valid:true", callback);` will select all objects having its property "valid" set to `true`



