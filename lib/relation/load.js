/**
 * Based on the given relationship-definition, assigns the pivot table or foreign key
 * to link all related models to the main model.
 *
 * model ...
 * relatedModel ...
 * pivot: model -> *relatedModel(s)
 * => model -*> relatedModel(s)
 *
 * or
 *
 * model: *relatedModel(s)
 * relatedModel ...
 * => model -*> relatedModel(s)
 *
 */
"use strict";

var o = require("../object"),
	Relation = require("./RelationshipFactory"),
	getRelationship = require("./getRelationshipObject");

/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with resolved relationship
 */
function load(data, defRelation) {
	var relation = new Relation(data, defRelation);

	o.forEach(relation.model, function (pk, target) {
		relation.load(pk);
	});

	return relation.model;
}

module.exports = load;
