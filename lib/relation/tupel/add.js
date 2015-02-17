/**
 * GUIDELINE (possibly)
 *
 * 	- Never add objects/links on pivot table
 * 	- pivot tables are ether
 * 	- pivot tables are relationships
 *
 * There are two states: loaded and unloaded relationships
 *
 *  - Always add/remove, etc objects in models and update pivots (for loaded relationships?)
 *  - OR always use pivot tables and update models (works in all circumstances?)
 */
"use strict";

var getRelationshipObject = require("../getRelationshipObject"),
	common = require("../common"),
	load = require("./load");

/**
 * links a related tupel to its parent (relation) tupel
 *
 * @param {Object|Array} data			[description]
 * @param {String|Object} relationDef	[description]
 * @param {String|Number} pk          	[description]
 * @param {String|Number} foreignPk   	[description]
 */
function add(data, relationDef, pk, foreignPk) {
	var relatedTupel, pivot,
		r = getRelationshipObject(relationDef, data);

	if (r == null) {
		throw new Error("Invalid relationship definition", JSON.stringify(relationDef));
	}

	relatedTupel = r.relatedModel[foreignPk];
	if (relatedTupel == null) {
		return;
	}

	// locate pivot and add foreign_key
	common.addLinkToPivot(r, pk, foreignPk);

	// and update links
	load(data, r, pk);
}

module.exports = add;
