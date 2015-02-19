/**
 * Reverse <relation.load> to gain objects containing primary_keys instead of linked objects
 */
"use strict";

var o = require("../object"),
	Relation = require("./RelationshipFactory"),
	updatePivots = require("./updatePivots");

/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with removed relationship
 */
function unload(data, defRelation) {
	var relation = new Relation(data, defRelation);

	// update references
	updatePivots(data, o.copy(defRelation));

	o.forEach(relation.parentModel, function (pk) {
		relation.unload(pk);
	});

	return relation.parentModel;
}

module.exports = unload;
