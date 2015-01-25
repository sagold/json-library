/**
 * Converts a json schema by the given relationship.
 *
 * # Why
 *
 * 	> Convert a json schema into a user friendly data structure and the created data back into its normalized version.
 *
 *	A json schema for normalized data (flat, no duplication, etc) is not the ideal representation for user input.
 *	Thus the json schema has to be modified in order to give users a more comprehensible ordering (i.e. for a json
 *	editor). Still, the data should be stored in a normalized version for usage in data (simpler structure, no
 *	hardcoded relationships, etc).
 *
 * 	Creating a json schema for normalized data must not be duplicated if it could be transformed by relationships. The
 * 	resulting data-structure may then be converted back, by the same relationship, into its normalized data version.
 *
 *
 * # Usage example
 *
 * 	given a json schema
 *	```js
 *		schema = {
 *			type: Object,
 *			properties: {
 *				parent: {
 *					type: Object
 *				},
 *				child: {}
 *			}
 *		}
 *	```
 *	and a relationship definition
 *	```js
 *		rel = {
 *			"model": "#/parent",
 *			"type": "has_many",
 *			"references": "#/child",
 *			"alias": "children",
 *		}
 *	```
 *	a new schema is build by `newSchema = schema.convert(schema, rel);` resulting in
 *	```js
 *		// newSchema:
 *		{
 *			type: Object,
 *			properties: {
 *				parent: {
 *					type: Object,
 *					properties: {
 *						"children": {
 *							// adjusted by pivot-table, if any
 *							type: Array
 *						}
 *					}
 *				}
 *			}
 *		}
 *	```
 */
"use strict";

var o = require("../object");

/**
 * Json pointer resolution on a json schema. Behaves like json pointer on data (omitting definition declarations in
 * pointer, like properties, items, etc) but returns the corresponding target in a json schema.
 *
 * @return {Mixed} schema definition object of given json pointer target
 */
function get(pointer, schema) {
	if (pointer == null || schema == null) {
		return null;
	}
	var pointers = stripPointerPrefix(pointer).split("/");
	return _get(pointers, schema);
}

// duplicated function in pointer/index.js
function stripPointerPrefix(pointer) {
	return pointer.replace(/[#/]*/, "");
}

function _get(path, schema) {
	var key = path.shift();
	if (key == null) {
		return schema;
	}

	if (schema.properties && schema.properties[key]) {
		return _get(path, schema.properties[key]);
	}
}

/**
 *
 * @param  {Object} jsonSchema  	jsonSchema to convert
 * @param  {Object} relationDef		relationship definition object
 * @return {Object}	resulting jsonSchema
 */
function convert(jsonSchema, relationDef) {
	if (relationDef == null || jsonSchema == null) {
		return null;
	}
	// pay attention to support multiple conversions:
	// is removing objects an issue? a model should not be used twice??
	var schema = o.copy(jsonSchema);
	// TODO: share logic, remove duplication
	// use same logic as in relation/getRelationshipObject
	var rel = {
		// if models are found
		// "valid": validate(defRelation, data),
		"model": get(relationDef.model, schema),
		"relatedModel": get(relationDef.references, schema),
		"type": relationDef.type || "has_one",

		// optional
		"alias": relationDef.alias,
		// either
		"foreign_key": relationDef.foreign_key,
		// or
		"pivot": get(relationDef.through, schema)
	};
	var relationshipKey = rel.alias || relationDef.references;

	// model = target, relatedModel = object to place into, alias or related model name = propertyName
	if (rel.type === "has_many") {
		// place relationship as array
		if (rel.model.type === "object") {
			// {
			// 		type: Object
			// 		properties: {
			// 			<references/alias>: {
			// 				type: Array,
			// 				items: <references>
			// 			}
			// 		}
			// }
			rel.model.properties = rel.model.properties || {};
			rel.model.properties[relationshipKey] = {
				type: Array,
				items: rel.relatedModel
			};
		}
	}

	return schema;
}

exports.convert = convert;
exports.get = get;



