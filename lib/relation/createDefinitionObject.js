"use strict";

var relationTypes = ["has_one", "has_many"];

/**
 * Converts a relationship definition string into its corresponding object. Will throw errors if the relationship
 * definition is invalid.
 *
 * ## A relationship is defined by the following string
 *
 * 	`"[model] [[type]:[related] [mapping]:[path] (as:[alias])]"`
 *
 * 	- model		{JsonPointer} to parent model on which related tupels are loaded
 * 	- type		of relationship: 'has_one' or 'has_many'
 * 	- related	{JsonPointer} to related model containing referenced tupels
 * 	- mapping	type of relationship map. Either: 'on' or 'through'
 * 				'on' {property} will resolve to property on parent tupel
 * 				'through' {JsonPointer} to mapping object
 * 	- path		to mapping object
 * 				if mapping is 'on', path is the property name on a tupel where the related key(s) are stored
 * 				if mapping is 'through', {JsonPointer} to mapping object
 * 	- alias		optional {property}. will load related tupels to the given property
 *
 *	reminder:
 *		- JsonPointer '#/path/to/' is identical to 'path/to'
 *		- Every expression except `model` may given in any order
 *
 *
 * ## Examples
 *
 * ### "#/parent has_one:#/child on:child_id"
 *
 *	```json
 * 		{
 * 			parent: {
 * 				p_01: {
 * 					child_id: c_01
 * 				},
 * 				p_02: {
 * 					child_id: c_01
 * 				}
 * 			},
 * 			child: {
 * 				c_01: {id: "c_01"},
 * 				c_02: {id: "c_02"}
 * 			}
 * 		}
 * 	```
 *
 * 	will result in
 *
 *	```json
 * 		{
 * 			parent: {
 * 				p_01: {
 * 					child_id: {id: "c_01"}
 * 				},
 * 				p_02: {
 * 					child_id: {id: "c_01"}
 * 				}
 * 			...
 * 	```
 *
 * ### "#/parent has_many:#/children through:parent_children alias:workload"
 *
 *	```json
 * 		{
 * 			parent: {
 * 				p_01: {}
 * 			},
 * 			child: {
 * 				c_01: {id: "c_01"},
 * 				c_02: {id: "c_02"}
 * 			},
 * 			parent_children: {
 * 				p_01: ["c_02", "c_01"]
 * 			}
 * 		}
 * 	```
 *
 * 	will result in
 *
 *	```json
 * 		{
 * 			parent: {
 * 				p_01: {
 * 					workload: [
 * 						{id: "c_02"},
 * 						{id: "c_01"}
 * 					]
 * 				}
 * 			...
 * 	```
 *
 * @throws {Error} If any required expressions are missing
 *
 * @param  {String} relationship as described
 * @return {Object}
 */
function createDefinitionObject(relationship) {
	var properties;

	if (typeof relationship === "string") {

		properties = relationship.split(" ");
		relationship = {};

		properties.forEach(function (item) {
			var properties;

			if (item.indexOf(":") === -1) {
				relationship.model = item;

			} else {
				properties = item.split(":");
				if (relationTypes.indexOf(properties[0]) > -1) {
					relationship["type"] = properties[0];
					relationship["references"] = properties[1];

				} else {
					relationship[properties[0]] = properties[1];
				}
			}
		});

		if (relationship.on == null && relationship.as == null) {
			throw new Error('"as:<alias>" or "on:<foreign_key>" missing in relationship definition');
		}
		if (relationship.model == null) {
			throw new Error('no model defined in relationship definition');
		}
		if (relationship.type == null) {
			throw new Error('no related model defined in relationship definition');
		}

		relationship.alias = relationship.as;
		delete relationship.as;

		relationship.foreign_key = relationship.on;
		delete relationship.on;
	}

	return relationship;
}

module.exports = createDefinitionObject;
