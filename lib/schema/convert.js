"use strict";

var json = require("../json"),
	get = require("./get");


/**
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
	var schema = json.copy(jsonSchema);
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

module.exports = convert;
