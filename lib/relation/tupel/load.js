"use strict";

var getRelationship = require("../getRelationshipObject");

var loadByType = {

	"has_many:through:alias": function (r, tupelPk) {
		addManyTupels(r.model[tupelPk], r.alias, r.pivot[tupelPk], r.relatedModel);
	},

	"has_many:foreign_key:alias": function (r, tupelPk) {
		addManyTupels(r.model[tupelPk], r.alias, r.model[tupelPk][r.foreign_key], r.relatedModel);
	},

	"has_many:foreign_key": function (r, tupelPk) {
		addManyTupels(r.model[tupelPk], r.foreign_key, r.model[tupelPk][r.foreign_key], r.relatedModel);
	},

	"has_one:through:alias": function (r, tupelPk) {
		addOneTupel(r.model[tupelPk], r.alias, r.pivot[tupelPk], r.relatedModel);
	},

	"has_one:foreign_key:alias": function (r, tupelPk) {
		addOneTupel(r.model[tupelPk], r.alias, r.model[tupelPk][r.foreign_key], r.relatedModel);
	},

	"has_one:foreign_key": function (r, tupelPk) {
		addOneTupel(r.model[tupelPk], r.foreign_key, r.model[tupelPk][r.foreign_key], r.relatedModel);
	}
}

/**
 * @param  {Object|Array} data      data containing models
 * @param  {Object} defRelation		relationship definition object
 * @return {Object|Array} model with resolved relationship
 */
function load(data, defRelation, tupelPk) {
	var model,
		r = getRelationship(defRelation, data);

	if (r == null) {
		throw Error("invalid relationModel\n: " + JSON.stringify(defRelation));

	} else if (loadByType[r.type] == null) {
		throw new Error("Unknown relationship type: " + r.type);

	} else {
		loadByType[r.type](r, tupelPk);
	}

	return r.model;
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

