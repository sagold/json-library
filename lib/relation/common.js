"use strict";

var o = require("../object");


function generatePk(model, template) {
	var i = 0, pk = template;
	while(model[pk] != null) {
		pk = template + "-" + i;
		i += 1;
	}
	return pk;
}

function getPrimaryKey(referencedModel, referencedTupel, pkPropertyOrDefault) {
	var pk = o.keyOf(referencedModel, referencedTupel);

	if (pk == null) {
		pk = referencedTupel[pkPropertyOrDefault];
		if (pk && referencedModel[pk] === null) {
			// use given properties value of related tupel as a pk
		} else if (pkPropertyOrDefault && referencedModel[pkPropertyOrDefault] == null) {
			// use given value as pk
			pk = pkPropertyOrDefault;
		} else {
			// generate a pk
			pk = generatePk(referencedModel, pkPropertyOrDefault);
		}
	}

	return pk;
}

/**
 * add relationship to pivot table
 *
 * @param {RelationshipObject} r
 * @param {String|Number} pk		parent pk (property name)
 * @param {String|Number} foreignPk	pk of related model
 */
function addLinkToPivot(r, pk, foreignPk) {

	if (r.through) {
		if (Array.isArray(r.through[pk])) {
			r.through[pk].push(foreignPk);

		} else if (Object.prototype.toString.call(r.through[pk]) === "[object Object]") {
			r.through[pk] = foreignPk;
		}

	} else if (Array.isArray(r.model[pk][r.foreign_key])) {
		r.model[pk][r.foreign_key].push(foreignPk);

	} else {
		r.model[pk][r.foreign_key] = foreignPk;
	}
}

exports.generatePk = generatePk;
exports.getPrimaryKey = getPrimaryKey;
exports.addLinkToPivot = addLinkToPivot;

