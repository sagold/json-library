"use strict";

var o = require("../object");


function generatePk(model, template) {
	var i = 0, pk = template;
	while(model[pk] != null) {
		pk = template + "-" + i;
	}
	return pk;
}

function getPrimaryKey(referencedModel, referencedTupel, pkPropertyOrDefault) {
	var pk = o.keyOf(referencedModel, referencedTupel);

	if (pk == null) {
		pk = referencedTupel[pkPropertyOrDefault];
		if (pk && referencedModel[pk] === null) {
			// use given properties value of related tupel as a pk
		} else if (pkPropertyOrDefault && referencedModel[pkPropertyOrDefault] == null) {
			// use given value as pk
			pk = pkPropertyOrDefault;
		} else {
			// generate a pk
			pk = generatePk(referencedModel, pkPropertyOrDefault);
		}
	}

	return pk;
}

exports.generatePk = generatePk;
exports.getPrimaryKey = getPrimaryKey;
