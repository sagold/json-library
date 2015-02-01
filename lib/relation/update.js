/**
 * Updates possible pivot tables of the given relationship
 */
"use strict";

var o = require("../object"),
	getPrimaryKey = require("./common").getPrimaryKey,
	getRelationship = require("./getRelationshipObject");


function update(data, defRelation) {
	var model, target,
		r = getRelationship(defRelation, data);

	model = r.model;

	console.log("type", r.type);

	switch (r.type) {

		case "has_many:through:alias":
			// o.forEach(model, function (pk) {
			// 	delete model[pk][r.alias];
			// });
			break;

		case "has_many:foreign_key:alias":
			// o.forEach(model, function (pk, target) {
			// 	delete target[r.alias];
			// });
			break;

		case "has_many:foreign_key":
			// o.forEach(model, function (pk) {
			// 	replaceTupels(model[pk], r.foreign_key, r.relatedModel);
			// });
			break;

		case "has_one:through:alias":
			o.forEach(model, function (pk) {
				if (model[pk][r.alias] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.alias], pk);
				if (r.relatedModel[pkOfRelatedModel] == null) {
					// add it to relatedModel
					r.relatedModel[pkOfRelatedModel] = model[pk][r.alias];
				}

				r.pivot[pk] = pkOfRelatedModel;
				// Cleanup obsolete relationships?
			});
			break;

		case "has_one:foreign_key:alias":
			o.forEach(model, function (pk, targetModel) {
				if (model[pk][r.alias] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.alias], pk);
				if (r.relatedModel[pkOfRelatedModel] == null) {
					// add it to relatedModel
					r.relatedModel[pkOfRelatedModel] = model[pk][r.alias];
				}

				// and update primary key
				if (model[pk][r.foreign_key] !== pkOfRelatedModel) {
					// unlink other model?
					model[pk][r.foreign_key] = pkOfRelatedModel;
				}
			});
			break;

		case "has_one:foreign_key":
			o.forEach(model, function (pk, targetModel) {
				if (model[pk][r.foreign_key] == null) {
					return;
				}

				var pkOfRelatedModel = getPrimaryKey(r.relatedModel, model[pk][r.foreign_key], pk);
				if (r.relatedModel[pkOfRelatedModel] == null) {
					// add it to relatedModel
					r.relatedModel[pkOfRelatedModel] = model[pk][r.foreign_key];
				}
			});
			break;

		default:
			throw new Error("Unknown relationship type: " + r.type);
	}

	return model;
}

module.exports = update;
