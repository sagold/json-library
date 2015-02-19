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


/**
 * Creates a relationship by the given type
 *
 * @param {Object|Array} data  			holding models and possible pivots
 * @param {String|Object} relationDef	relationship definition {@see createDefinitionObject}
 * @param {Boolean} create				true if pivot should be created
 */
function RelationshipFactory(data, relationDef, create) {
	if (relationDef.constructor === RelationshipFactory) {
		return relationDef;
	}

	var r = createDefinitionObject(relationDef);
	var hasMany = (r.type === "has_many");

	this.parentModel = p.get(data, r.model);
	this.relatedModel = p.get(data, r.references);
	this.pivotModel = p.get(data, r.through) || false;
	this.foreignKey = r.foreign_key || false;
	this.alias = r.alias || false;

	create = (create == true);

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

	var valid = hasMany ? this.initHasMany() : this.initHasOne();
	if (valid === false) {
		throw new Error("Positive validated definition is invalid: " + JSON.stringify(relationDef), data);
	}
}

RelationshipFactory.prototype.initHasMany = function () {
	this.id = false;

	if (this.alias && this.pivotModel) {
		this.id = "has_many:through:alias";
		withRelation.call(this, many.throughAlias);

	} else if (this.alias && this.foreignKey) {
		this.id = "has_many:foreign_key:alias";
		withRelation.call(this, many.foreignKeyAlias);

	} else if (this.foreignKey) {
		this.id = "has_many:foreign_key";
		withRelation.call(this, many.foreignKey);
	}

	return this.id;
}

RelationshipFactory.prototype.initHasOne = function () {
	this.id = false;

	if (this.alias && this.pivotModel) {
		this.id = "has_one:through:alias";
		withRelation.call(this, one.throughAlias);

	} else if (this.alias && this.foreignKey) {
		this.id = "has_one:foreign_key:alias";
		withRelation.call(this, one.foreignKeyAlias);

	} else if (this.foreignKey) {
		this.id = "has_one:foreign_key";
		withRelation.call(this, one.foreignKey);
	}

	return this.id;
}

/**
 * extends Factory by relation type
 * @param  {Obejct} relationType containing functions to apply on factory instance
 */
function withRelation(relationType) {
	var parent = this;
	Object.keys(relationType).forEach(function (name) {
		parent[name] = relationType[name];
	});
}


module.exports = RelationshipFactory;
