/**
 * Updates possible pivot tables of the given relationship
 */
"use strict";

var o = require("../object"),
	Relation = require("./RelationshipFactory");


function updatePivots(data, defRelation, replace) {
	var relation = new Relation(data, defRelation);
	function updatePivot(pk) {
		relation.update(pk);
	}

	o.forEach(relation.parentModel, updatePivot);
	return relation.model;
}

module.exports = updatePivots;
