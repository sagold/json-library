# pointer

the json pointer implementation:

```js
	var data = {
		parent: {
			child: {
				title: "title of child"
			}
		}
	}

	var titleOfChild = pointer.get(data, "#/parent/child/title"); // "title of child"
```

may also be used to apply values on an object:

```js
	var data = {
		parent: {
			children: [
				{
					title: "title of child"
				}
			]
		}
	};

	pointer.set(data, "#/parent/children/1", {title: "second child"});

	console.log(data.parent.children.length); // 2
```

or to delete properties or array items

```js
	pointer.delete(data, "#/parent/arrayOrObject/1");
```


## Helpers

`pointer.join` joins all arguments to a valid json pointer:

```js
	var key = "child";
	var target = pointer.join("parent", key, "title"); // "#/parent/child/title"
```