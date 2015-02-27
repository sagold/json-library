# json-libary

Contents

```js
	{
		object: {
			// converts an object to an array containing object's values
			asArray(value):Array
			// iterate over arrays and objects alike
			forEach(value, callback):void
			// returns the index or property of the given value
			keyOf(data, value):Mixed
			// returns an array with indices or properties
			keys(value):Array
			// returns an array with values of the given array or object
			values(value):Array
		}
		pointer: {
			// return value at the json pointer
			get(data, pointer):value
			// set values on an object to the given json pointer target
			set(data, pointer, value):data
			// joins arguments to a valid json pointer
			join(pointer*):pointer
		}
		query: {
			// json pointer, extended by glob pattern and filter
			query(data, query, callback):void
			// query, returning result as array
			queryGet(data, query, type):Array
		}
		json: {
			// stringify data containing circular dependencies
			stringify(data, replacer, pretty):String
			// parse json data, restoring circular dependencies
			parse(jsonString):Mixed
		}
		relation: {
			// creates and establishes a relationship
			new Relationship(data, relationshipDefinitionString):relationship
		}
	}
```
