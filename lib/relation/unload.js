/**
 * Reverse <relation.load> to gain objects containing primary_keys instead of linked objects
 */
"use strict";

var pointer = require("../pointer"),
	o = require("../object");

function replaceTupel(targetModel, foreign_key, relatedModel) {
	targetModel[foreign_key] = o.keyOf(relatedModel, targetModel[foreign_key]);
}

function replaceTupels(targetModel, foreign_key, relatedModel) {
	if (!Array.isArray(targetModel[foreign_key]) || targetModel[foreign_key].length === 0) {
		return;
	}

	var key, keys = [];
	targetModel[foreign_key].forEach(function (value, index) {
		key = o.keyOf(relatedModel, value);
		if (key) {
			keys.push(key);
		}
	});

	targetModel[foreign_key] = keys;
}

// ! shared logic with load...
// probably use an controller:type => has-one, has_one+pivot, has_many, has_many+pivot, ...
function unload(data, defRelation) {
	var model		= pointer.get(defRelation.model, data),
		relatedModel= pointer.get(defRelation.references, data),
		alias		= defRelation.alias,
		type		= defRelation.type || "has_one",
		foreign_key	= defRelation.foreign_key,
		pivot		= pointer.get(defRelation.through, data),
		target;

	if (pivot && alias && type === "has_many") {
		// has_many alias through

		o.forEach(model, function (pk) {
			delete model[pk][alias];
		});

	} else if (pivot && alias) {
		// has_one alias through

		o.forEach(model, function (pk) {
			model[pk][alias] = pivot[pk];
		});

	// resolve many keys within model
	} else if (foreign_key && type === "has_many") {
		// has_many on foreign_key

		o.forEach(model, function (pk) {

			replaceTupels(model[pk], foreign_key, relatedModel);
		});

	} else if (foreign_key) {
		// has_one on foreign_key

		o.forEach(model, function (pk) {
			target = model[pk];
			replaceTupel(target, foreign_key, relatedModel);

			if (alias) {
				delete target[alias];
			}
		});

	// not a valid relationship definition
	} else if (validate(defRelation, data)) {
		throw new Error("Positive validated definition is invalid", defRelation, data);
	} else {
		throw new Error("Invalid relationship definition", defRelation);
	}

	return model;
}

module.exports = unload;