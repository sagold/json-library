/**
 * Based on the given relationship-definition, loads model and its reference to another model
 */
"use strict";

var o = require("../object"),
	getRelationship = require("./getRelationshipObject");


/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with resolved relationship
 */
function load(data, defRelation) {
	var model,
		r = getRelationship(defRelation, data);

	if (r == null) {
		throw Error("invalid relationModel", defRelation);
	}

	model = r.model;

	switch (r.type) {

		case "has_many:through:alias":
			o.forEach(r.pivot, function (pk, keys) {
				addManyTupels(model[pk], r.alias, keys, r.relatedModel);
			});
			break;

		case "has_many:foreign_key:alias":
			o.forEach(model, function (pk, target) {
				addManyTupels(target, r.alias, target[r.foreign_key], r.relatedModel);
			});
			break;

		case "has_many:foreign_key":
			o.forEach(model, function (pk, target) {
				addManyTupels(target, r.foreign_key, target[r.foreign_key], r.relatedModel);
			});
			break;

		case "has_one:through:alias":
			o.forEach(r.pivot, function (pk, key) {
				addOneTupel(model[pk], r.alias, key, r.relatedModel);
			});
			break;

		case "has_one:foreign_key:alias":
			o.forEach(model, function (pk, target) {
				addOneTupel(target, r.alias, target[r.foreign_key], r.relatedModel);
			});
			break;

		case "has_one:foreign_key":
			o.forEach(model, function (pk, target) {
				addOneTupel(target, r.foreign_key, target[r.foreign_key], r.relatedModel);
			});
			break;

		default:
			throw new Error("Unknown relationship type: " + r.type);
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
