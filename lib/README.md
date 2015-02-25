# json-libary

Contents

```js
	{
		object: {
			asArray: Function			// converts an object to an array containing object's values
			forEach: Function			// iterate over arrays and objects alike
			keyOf: Function				// returns the index or property of the given value
			keys: Function				// returns an array with indices or properties
			values: Function			// returns an array with values of the given array or object
		}
		pointer: {
			get: Function				// return value at the json pointer
			set: Function				// set values on an object to the given json pointer target
			join: Function				// joins arguments to a valid json pointer
		}
		query: {
			query: Function				// json pointer, extended by glob pattern and filter
			queryGet: Function			// query, returning result as array
		}
		json: {
			stringify: Function			// stringify data containing circular dependencies
			parse: Function				// parse json data, restoring circular dependencies
		}
		relation: {
			Relationship: Function		// constructor. creates and establishes a relationship
			validate: Function			// validates the relationship definition object
		}
	}
```
