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
	var model = pointer.get(defRelation.model, data),
		pk, target,
		relatedModel = pointer.get(defRelation.references, data),
		alias = defRelation.alias,
		type = defRelation.type || "has_one",
		foreign_key = defRelation.foreign_key,
		pivot = pointer.get(defRelation.through, data);

	// resolve single keys within pivot
	if (pivot && alias && type !== "has_many") {

		for (pk in pivot) {
			if (pivot.hasOwnProperty(pk)) {

				target = model[pk];
				addOneTupel(target, alias, pivot[pk], relatedModel);
			}
		}

	// resolve many keys within pivot
	} else if (pivot && alias && type === "has_many") {

		for (pk in pivot) {
			if (pivot.hasOwnProperty(pk)) {

				target = model[pk];
				addManyTupels(target, alias, pivot[pk], relatedModel);
			}
		}

	// resolve keys within model
	} else if (foreign_key) {

		alias = alias || foreign_key;

		for (pk in model) {
			if (model.hasOwnProperty(pk)) {

				target = model[pk];
				addOneTupel(target, alias, target[foreign_key], relatedModel);
			}
		}

	// not a valid relationship definition
	} else {

		if (validate(defRelation, data)) {
			throw new Error("Positive validated definition is invalid", defRelation, data);
		} else {
			throw new Error("Invalid relationship definition", defRelation);
		}
	}

	return model;
}

function addManyTupels(targetModel, alias, foreign_keys, relatedModel) {
	var reference;
	targetModel[alias] = [];
	for (var i = 0, l = foreign_keys.length; i < l; i += 1) {
		reference = relatedModel[ foreign_keys[i] ];
		targetModel[alias].push(reference);
	}
}

function addOneTupel(targetModel, alias, foreign_key, relatedModel) {
	targetModel[alias] = relatedModel[foreign_key];
}

module.exports = load;
