"use strict";

var getRelationshipObject = require("../getRelationshipObject"),
	p = require("../../pointer"),
	getPrimaryKey = require("../common").getPrimaryKey,
	o = require("../../object");


var updateByType = {

	"has_many:through:alias": function (r, pk) {
		var relatedTupels = p.get(r.model, "#/" + pk + "/" + r.alias);
		if (relatedTupels == null) {
			return;
		}

		o.forEach(relatedTupels, function updateChild(child) {

			var pkOfRelatedModel = getPrimaryKey(r.relatedModel, child, pk);
			addTupel(r.relatedModel, pkOfRelatedModel, child);
			pushReference(r.pivot, pk, pkOfRelatedModel);
		});
	},

	"has_many:foreign_key:alias": function (r, pk) {
		var tupel = r.model[pk];
		var relatedTupels = p.get(r.model, p.join(pk, r.alias));
		if (relatedTupels == null) {
			return;
		}

		o.forEach(relatedTupels, function updateChild(child) {

			var pkOfRelatedModel = getPrimaryKey(r.relatedModel, child, pk);
			addTupel(r.relatedModel, pkOfRelatedModel, child);
			pushReference(tupel, r.foreign_key, pkOfRelatedModel);
		});
	},

	"has_many:foreign_key": function (r, pk) {
		// already done
	},

	"has_one:through:alias": function (r, pk) {
		var relatedTupel = p.get(r.model, p.join(pk, r.alias));
		if (relatedTupel == null) {
			return;
		}

		var pkOfRelatedModel = getPrimaryKey(r.relatedModel, relatedTupel, pk);
		addTupel(r.relatedModel, pkOfRelatedModel, relatedTupel);
		setReference(r.pivot, pk, pkOfRelatedModel);
	},

	"has_one:foreign_key:alias": function (r, pk) {
		var tupel = r.model[pk];
		var relatedTupel = p.get(r.model, p.join(pk, r.alias));
		if (relatedTupel == null) {
			return;
		}

		var pkOfRelatedModel = getPrimaryKey(r.relatedModel, relatedTupel, pk);
		addTupel(r.relatedModel, pkOfRelatedModel, relatedTupel);
		setReference(tupel, r.foreign_key, pkOfRelatedModel);
	},

	"has_one:foreign_key": function (r, pk) {
		var relatedTupel = p.get(r.model, p.join(pk, r.foreign_key))
		if (relatedTupel == null) {
			return;
		}

		var pkOfRelatedModel = getPrimaryKey(r.relatedModel, relatedTupel, pk);
		addTupel(r.relatedModel, pkOfRelatedModel, relatedTupel);
	}
};

function update(data, defRelation, tupelPk, replace) {
	var model,
		replace = (replace === true),
		r = getRelationshipObject(defRelation, data);

	if (r == null) {
		throw Error("invalid relationModel\n: " + JSON.stringify(defRelation));

	} else if (updateByType[r.type] == null) {
		throw new Error("Unknown relationship type: " + r.type);
	}

	updateByType[r.type](r, tupelPk, replace);
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

module.exports = update;
