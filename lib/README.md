# json-libary

functions exported:

```js
	{
		pointer: {
			get: Function,		// return value at the json pointer
			set: Function,		// set values on an object to the given json pointer target
			join: Function		// joins arguments to a valid json pointer
		}
		query: Function,		// json pointer, extended by glob pattern and filter
		relation: {
			load: Function,		// apply a relationship on the given object
			unload: Function,	// deconstruct a relationship of the object
			validate: Function	// validate the relationship definition object
		}
	}
```
