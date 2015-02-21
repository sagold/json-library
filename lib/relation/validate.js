/**
 * Validates a relationship definition on an optional data-object
 */
"use strict";

var pointer = require("../pointer");

function validate(definition, data, create) {
	if (definition == null) {
		return false;
	}

	create = (create === true);

	var model = definition.model,
		related = definition.references,
		type = definition.type || "has_one",
		foreign_key = definition.foreign_key,
		alias = definition.alias,
		through = definition.through;

	if (data) {
		model = pointer.get(data, model);
		related = pointer.get(data, related);
		through = pointer.get(data, through);
	}

	if (create && data) {
		// create missing pivot
		if (through == null && definition.through) {
			through = {};
			pointer.set(data, definition.through, through);
		}

		if (model == null) {
			model = {};
			pointer.set(data, definition.model, model);
		}

		if (related == null) {
			related = {};
			pointer.set(data, definition.references, related);
		}
	}

	if (model && related && (foreign_key || (through && alias))) {
		return true;
	}
	// else if (!model) {
	// 	throw new Error("Model of relationship not found " + definition.model);
	// } else if (!related) {
	// 	throw new Error("Related model of relationship not found " + definition.references);
	// } else if (foreign_key || (through && alias)) {
	// 	throw new Error("Related model of relationship not found " + definition.references);
	// } else {
	// 	throw new Error("Either foreign_key or through & alias are required" + JSON.stringify(definition));
	// }

	return false;
}

module.exports = validate;