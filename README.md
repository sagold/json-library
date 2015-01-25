# json library

> still unstable API

A range of utility modules and function to work with json or js objects

currently includes

- json pointer implementation, extended by a pointer.set option, which creates objects on its path
- json query as a json pointer extension supporting wildcard (*) and filter methods
- json relation, containing a relationship definition and utilities to setup and deconstruct relationships

## json pointer

**get**

```js
var res = pointer.get("#/data/in/2", {
	data: {
		in: [
			"first",
			"second",
			"third"
		]
	}
});
console.log(res); // "third"
```

**set**

array creation not yet implemented

```js
var res = pointer.set("#/data/in/2", {}, "second");
console.log(res) // {data: { in: { 2: "second" } }}
```