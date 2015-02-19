/**
 * Relationship factory
 *
 * returns relation type specific helper object
 */
"use strict";

var validate = require("./validate"),
	one = require("./one"),
	many = require("./many"),
	o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	createDefinitionObject = require("./createDefinitionObject");


function RelationshipFactory(data, relationDef, create) {
	if (relationDef.constructor === RelationshipFactory) {
		return relationDef;
	}

	create = (create == true);
	var r = createDefinitionObject(relationDef),
		type;

	var parentModel = p.get(data, r.model);
	var relatedModel = p.get(data, r.references);
	var pivotModel = p.get(data, r.through) || false;
	var hasMany = (r.type === "has_many");
	var foreignKey = r.foreign_key || false;
	var alias = r.alias || false;

	// validate
	if (validate(r, data, true) === false) {
		throw new Error("invalid relationship definition: " + JSON.stringify(relationDef));
	}

	if (create === true) {
		// create missing objects
		if (pivotModel == null && r.through) {
			pivotModel = {};
			p.set(data, r.references, pivotModel);
		}
	}

	if (pivotModel && alias && hasMany) {
		type = "has_many:through:alias";
		foreignKey = null;

		withRelation.call(this, many.throughAlias);

	} else if (pivotModel && alias) {
		// has_one alias through
		type = "has_one:through:alias";
		foreignKey = null;

		withRelation.call(this, one.throughAlias);

	} else if (foreignKey && alias && hasMany) {
		type = "has_many:foreign_key:alias";
		pivotModel = null;

		withRelation.call(this, many.foreignKeyAlias);

	} else if (foreignKey && hasMany) {
		type = "has_many:foreign_key";
		pivotModel = null;

		withRelation.call(this, many.foreignKey);

	} else if (foreignKey && alias) {
		type = "has_one:foreign_key:alias";
		pivotModel = null;

		withRelation.call(this, one.foreignKeyAlias);

	} else if (foreignKey) {
		type = "has_one:foreign_key";

		withRelation.call(this, one.foreignKey);

	} else {
		throw new Error("Positive validated definition is invalid: " + JSON.stringify(relationDef), data);
	}

	this.parentModel = parentModel;
	this.relatedModel = relatedModel;
	this.pivotModel = pivotModel;
	this.alias = alias;
	this.foreignKey = foreignKey;
}

function withRelation(relationType) {
	var parent = this;
	Object.keys(relationType).forEach(function (name) {
		parent[name] = relationType[name];
	});
}


module.exports = RelationshipFactory;
