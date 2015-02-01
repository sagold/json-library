/**
 * Reverse <relation.load> to gain objects containing primary_keys instead of linked objects
 */
"use strict";

var o = require("../object"),
	update = require("./update"),
	getRelationship = require("./getRelationshipObject");

/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with removed relationship
 */
function unload(data, defRelation) {
	var model, target,
		r = getRelationship(o.copy(defRelation), data);

	// update references
	update(data, o.copy(defRelation));

	model = r.model;

	switch (r.type) {

		case "has_many:through:alias":
			o.forEach(model, function (pk) {
				delete model[pk][r.alias];
			});
			break;

		case "has_many:foreign_key:alias":
			o.forEach(model, function (pk, target) {
				delete target[r.alias];
			});
			break;

		case "has_many:foreign_key":
			o.forEach(model, function (pk) {
				replaceTupels(model[pk], r.foreign_key, r.relatedModel);
			});
			break;

		case "has_one:through:alias":
			o.forEach(model, function (pk) {
				model[pk][r.alias] = r.pivot[pk];
			});
			break;

		case "has_one:foreign_key:alias":
			o.forEach(model, function (pk, target) {
				replaceTupel(target, r.foreign_key, r.relatedModel);
				delete target[r.alias];
			});
			break;

		case "has_one:foreign_key":
			o.forEach(model, function (pk, target) {
				replaceTupel(target, r.foreign_key, r.relatedModel);
			});
			break;

		default:
			throw new Error("Unknown relationship type: " + r.type);
	}

	return model;
}

/**
 * Remove tupels from has_many relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} foreign_key  primary key of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function replaceTupels(targetModel, foreign_key, relatedModel) {
	var key, keys;

	if (!Array.isArray(targetModel[foreign_key]) || targetModel[foreign_key].length === 0) {
		return;
	}

	keys = [];
	targetModel[foreign_key].forEach(function (value, index) {
		key = o.keyOf(relatedModel, value);
		if (key) {
			keys.push(key);
		}
	});

	targetModel[foreign_key] = keys;
}

/**
 * Remove tupel from has_one relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} foreign_key  primary key of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function replaceTupel(targetModel, foreign_key, relatedModel) {
	targetModel[foreign_key] = o.keyOf(relatedModel, targetModel[foreign_key]);
}

module.exports = unload;
