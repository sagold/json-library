# query


At first query acts like a normal **json-pointer** where its match is passed to the given callback function:

```js
	var query = require("query").query;
	var data = {
		"parent": {
			"child": {"id": "child-1"}
		}
	};
	query(data, "#/parent/child/id", function (value, object, key) {
		// value = "child-1",
		// object = {"id": "child-1"}
		// key = "id"
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
	query(data, "#/*/child/id", function (value, object, key) {
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
	query(data, "#/**/id", function (value, object, key) {
		// will be called with value: "child-1" and "child-2"
	});
```

To **filter** all matched objects a filter may be applied on each single step:

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
	query(data, "#/**?valid:true&&ignore:undefined/child", function (value, object, key) {
		// will be called with value: {"id": "child-1"} only
	});
	// same result with
	query(data, "#/**?valid:!false/child", function (value, object, key) { // ...
```




