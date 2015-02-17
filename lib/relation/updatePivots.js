/**
 * Updates possible pivot tables of the given relationship
 */
"use strict";

var o = require("../object"),
	update = require("./tupel/update"),
	getRelationship = require("./getRelationshipObject");


function updatePivots(data, defRelation, replace) {
	var r = getRelationship(defRelation, data);

	function updatePivot(pk) {
		update(data, r, pk, replace);
	}

	o.forEach(r.model, updatePivot);

	return r.model;
}

module.exports = updatePivots;
