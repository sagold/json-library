/**
 * Validates a relationship definition on an optional data-object
 */
"use strict";

var pointer = require("../pointer");

function validate(definition, data) {
	if (definition == null) {
		return false;
	}

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

	if (model && related && (foreign_key || (through && alias))) {
		return true;
	}

	return false;
}

module.exports = validate;