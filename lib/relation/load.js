/**
 * Based on the given relationship-definition, loads model and its reference to another model
 */
"use strict";

var pointer = require("../pointer"),
	validate = require("./validate");

/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with resolved relationship
 */
function load(data, defRelation) {
	var model		= pointer.get(defRelation.model, data),
		relatedModel= pointer.get(defRelation.references, data),
		alias		= defRelation.alias,
		type		= defRelation.type || "has_one",
		foreign_key	= defRelation.foreign_key,
		pivot		= pointer.get(defRelation.through, data),
		target;

	// resolve many keys within pivot
	if (pivot && alias && type === "has_many") {
		// has_many alias through

		Object.keys(pivot).forEach(function (pk) {

			target = model[pk];
			addManyTupels(target, alias, pivot[pk], relatedModel);
		});

	// resolve single keys within pivot
	} else if (pivot && alias) {
		// has_one alias through

		Object.keys(pivot).forEach(function (pk) {

			target = model[pk];
			addOneTupel(target, alias, pivot[pk], relatedModel);
		});

	// resolve many keys within model
	} else if (foreign_key && type === "has_many") {
		// has_many on foreign_key

		alias = alias || foreign_key;

		Object.keys(model).forEach(function (pk) {

			target = model[pk];
			addManyTupels(target, alias, target[foreign_key], relatedModel);
		});

	// resolve keys within model
	} else if (foreign_key) {
		// has_one on foreign_key

		alias = alias || foreign_key;

		Object.keys(model).forEach(function (pk) {

			target = model[pk];
			addOneTupel(target, alias, target[foreign_key], relatedModel);
		});

	// not a valid relationship definition
	} else if (validate(defRelation, data)) {
		throw new Error("Positive validated definition is invalid", defRelation, data);
	} else {
		throw new Error("Invalid relationship definition", defRelation);
	}

	return model;
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

module.exports = load;
