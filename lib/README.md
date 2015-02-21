# json-libary

functions exported:

```js
	{
		pointer: {
			get: Function,				// return value at the json pointer
			set: Function,				// set values on an object to the given json pointer target
			join: Function				// joins arguments to a valid json pointer
		}
		query: {
			query: Function,			// json pointer, extended by glob pattern and filter
			queryGet: Function,			// query, returning result as array
		},
		relation: {
			Relationship: Function,		// Cosntructor. creates and establishes a relationship
			validate: Function			// validate the relationship definition object
		},
		object: {
			// helpers, mainly methods which perform the same on arrays and objects
		}
	}
```
