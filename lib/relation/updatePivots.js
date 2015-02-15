/**
 * Updates possible pivot tables of the given relationship
 */
"use strict";

var o = require("../object"),
	getPrimaryKey = require("./common").getPrimaryKey,
	getRelationship = require("./getRelationshipObject");


function updatePivots(data, defRelation, replace) {
	var model,
		replace = replace === true,
		r = getRelationship(defRelation, data);

	model = r.model;

	switch (r.type) {
		case "has_many:through:alias":
			o.forEach(model, function updateChildren(pk, tupel) {

				if (tupel[r.alias]) {
					o.forEach(tupel[r.alias], function updateChild(child) {

						var pkOfRelatedModel = getPrimaryKey(r.relatedModel, child, pk);
						addTupel(r.relatedModel, pkOfRelatedModel, child);
						pushReference(r.pivot, pk, pkOfRelatedModel);
					});
				}
			});
			break;

		case "has_many:foreign_key:alias":
			o.forEach(model, function updateChildren(pk, tupel) {
				if (tupel[r.alias]) {
					o.forEach(tupel[r.alias], function updateChild(child) {

						var pkOfRelatedModel = getPrimaryKey(r.relatedModel, child, pk);
						addTupel(r.relatedModel, pkOfRelatedModel, child);
						pushReference(tupel, r.foreign_key, pkOfRelatedModel);
					});
				}
			});
			break;

		case "has_many:foreign_key":
			// done
			break;

		case "has_one:through:alias":
			o.forEach(model, function (pk) {
				if (model[pk][r.alias] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.alias], pk);
				addTupel(r.relatedModel, pkOfRelatedModel, model[pk][r.alias]);
				setReference(r.pivot, pk, pkOfRelatedModel);
			});
			break;

		case "has_one:foreign_key:alias":
			o.forEach(model, function (pk, targetModel) {
				if (model[pk][r.alias] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.alias], pk);
				addTupel(r.relatedModel, pkOfRelatedModel, model[pk][r.alias]);
				setReference(model[pk], r.foreign_key, pkOfRelatedModel);
			});
			break;

		case "has_one:foreign_key":
			o.forEach(model, function (pk, targetModel) {
				if (model[pk][r.foreign_key] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.foreign_key], pk);
				addTupel(r.relatedModel, pkOfRelatedModel, model[pk][r.foreign_key]);
			});
			break;

		default:
			throw new Error("Unknown relationship type: " + r.type);
	}

	return model;
}

/**
 * Update link of a has_one relationship
 *
 * @param {Object} model		containing references
 * @param {String} key     		property name in model pointing to list of keys
 * @param {String} relatedPk	key to add
 */
function setReference(model, key, relatedPk) {
	if (model[key] !== relatedPk) {
		// unlink other model?
		model[key] = relatedPk;
	}
}

/**
 * Adds a related pk to a list of references, ensuring the list is an array with unique elements
 *
 * @param  {Object} model
 * @param  {String} key   		property name in model pointing to list of keys
 * @param  {String} relatedPk 	key to add
 */
function pushReference(model, key, relatedPk) {
	if (!Array.isArray(model[key])) {
		model[key] = o.asArray(model[key]);
	}

	if (model[key].indexOf(relatedPk) === -1) {
		model[key].push(relatedPk);
	}
}

/**
 * Add a new tupel on the model's pk. Prints a warning if another tupel will be overriden.
 *
 * @param {Object} model	where to tupel should be stored
 * @param {String} pk    	key on where to store the tupel
 * @param {Mixed} tupel		value to assign
 */
function addTupel(model, pk, tupel) {
	if (model[pk] == null) {
		model[pk] = tupel;
	} else if (model[pk] !== tupel) {
		console.warn("Overwriting " + pk + "with different child");
	}
}

module.exports = updatePivots;
