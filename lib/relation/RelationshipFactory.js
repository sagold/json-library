/**
 * Relationship factory
 *
 * returns relation type specific helper object
 */
"use strict";

var validate = require("./validate"),
	o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	createDefinitionObject = require("./createDefinitionObject");


function notImplemented(name) {
	return function () {
		throw new Error("method " + name + " not not implemented");
	}
}

RelationshipFactory.prototype.load = notImplemented("load");
// reverse load, updating pivot by linked tupels
RelationshipFactory.prototype.update = notImplemented("update");


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
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			parentModel[pk][alias] = pivotModel[pk].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		};

	} else if (pivotModel && alias) {
		// has_one alias through
		type = "has_one:through:alias";
		foreignKey = null;
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias or foreign_key
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			var fpk = pivotModel[pk];
			if (relatedModel[fpk]) {
				parentModel[pk][alias] = relatedModel[fpk];
			}
		};

	} else if (foreignKey && alias && hasMany) {
		type = "has_many:foreign_key:alias";
		pivotModel = null;
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			parentModel[pk][alias] = parentModel[pk][foreignKey].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		};

	} else if (foreignKey && hasMany) {
		type = "has_many:foreign_key";
		pivotModel = null;
		/**
		 * apply a relationship, assigning relatedModels on parentModel's foreign_key array
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			var keys = parentModel[pk][foreignKey] || [];
			parentModel[pk][foreignKey] = keys.map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		};

	} else if (foreignKey && alias) {
		type = "has_one:foreign_key:alias";
		pivotModel = null;
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			var fpk = parentModel[pk][foreignKey];
			if (relatedModel[fpk]) {
				parentModel[pk][alias] = relatedModel[fpk];
			}
		};

	} else if (foreignKey) {
		type = "has_one:foreign_key";
		/**
		 * apply a relationship, assigning relatedModels on parentModel's foreign_key
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		this.load = function load(pk) {
			var fpk = parentModel[pk][foreignKey];
			if (relatedModel[fpk]) {
				parentModel[pk][foreignKey] = relatedModel[fpk];
			}
		};

	} else {
		throw new Error("Positive validated definition is invalid: " + JSON.stringify(relationDef), data);
	}

	this.model = parentModel;
	this.relatedModel = relatedModel;
	this.pivotModel = pivotModel;
}

module.exports = RelationshipFactory;
