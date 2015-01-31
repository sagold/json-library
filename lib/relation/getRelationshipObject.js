/**
 * Evaluated relationship object
 */
"use strict";

var validate = require("./validate"),
	pointer = require("../pointer");

function getRelationshipObject(defRelation, data) {
	var r = {
		// if models are found
		"valid": validate(defRelation, data),

		"model": pointer.get(data, defRelation.model),
		"relatedModel": pointer.get(data, defRelation.references),
		"type": defRelation.type || "has_one",

		// optional
		"alias": defRelation.alias,
		// either
		"foreign_key": defRelation.foreign_key,
		// or
		"pivot": pointer.get(data, defRelation.through)
	};

	if (r.valid === false) {
		return null;
	}

	if (r.pivot && r.alias && r.type === "has_many") {
		// has_many alias through
		r.type = "has_many:through:alias";

		r.foreign_key = null;

	} else if (r.pivot && r.alias) {
		// has_one alias through
		r.type = "has_one:through:alias";

		r.foreign_key = null;

	} else if (r.foreign_key && r.alias && r.type === "has_many") {
		// has_many on foreign_key
		r.type = "has_many:foreign_key:alias";

		r.pivot = null;

	} else if (r.foreign_key && r.type === "has_many") {
		// has_many on foreign_key
		r.type = "has_many:foreign_key";

		r.pivot = null;

	} else if (r.foreign_key && r.alias) {
		// has_one foreign_key on alias
		r.type = "has_one:foreign_key:alias";

		r.pivot = null;

	} else if (r.foreign_key) {
		// has_one on foreign_key
		r.type = "has_one:foreign_key";

	} else {
		throw new Error("Positive validated definition is invalid", defRelation, data);
	}

	return r;
}

module.exports = getRelationshipObject;