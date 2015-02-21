"use strict";

var o = require("../object");


function generatePk(model, template) {
	var i = 0, pk = template;
	while(model[pk] != null) {
		pk = template + "_" + i;
		i += 1;
	}
	return pk;
}

function getPrimaryKey(referencedModel, referencedTupel, pkPropertyOrDefault) {
	var pk = o.keyOf(referencedModel, referencedTupel);

	if (pk == null) {

		if (Array.isArray(referencedModel)) {
			return referencedModel.length;
		}

		pk = referencedTupel[pkPropertyOrDefault];
		if (pk && referencedModel[pk] == null) {
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

/**
 * Assigns an array of tupels as relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} alias        alias on which to place tupel
 * @param {Array} foreign_key  			primary keys of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function addManyTupels(targetModel, alias, foreign_keys, relatedModel) {
	var reference;
	// This case: targetModel[alias] = targetModel[alias] || [];
	// would append to keys. And thus require replacement: targetModel[alias][index] = ...
	targetModel[alias] = [];
	for (var i = 0, l = foreign_keys.length; i < l; i += 1) {
		reference = relatedModel[ foreign_keys[i] ];
		targetModel[alias].push(reference);
	}
}

/**
 * Assign tupel as relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} alias        alias on which to place tupel
 * @param {String|Integer} foreign_key  primary key of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function addOneTupel(targetModel, alias, foreign_key, relatedModel) {
	targetModel[alias] = relatedModel[foreign_key];
}

/**
 * Add a new tupel on the model's pk
 *
 * @param {Object} model	where the tupel should be stored
 * @param {String} pk    	key on where to store the tupel
 * @param {Mixed} tupel		value to assign
 */
function addTupelToRelatedModel(model, pk, tupel) {
	model[pk] = tupel || model[pk];
}

exports.generatePk = generatePk;
exports.getPrimaryKey = getPrimaryKey;
exports.addLinkToPivot = addLinkToPivot;
exports.addTupelToRelatedModel = addTupelToRelatedModel;

