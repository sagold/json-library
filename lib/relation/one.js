"use strict";
/**
 * has one relationship separated by type of relationship.
 * @requires to be extended by RelationshipFactory
 *
 * # functions
 *
 * - load(pk)			link models based on pivot
 * - unload(pk)			remove linkes models and relationship
 * - update(pk)			update pivot based on linked models
 *
 *
 * # types
 *
 * - "foreignKey"		on foreignKey
 * - "foreignKeyAlias"	on foreignKey with alias
 * - "throughAlias"		on pivot with alias
 */
var o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	getPrimaryKey = require("./common").getPrimaryKey;


var hasOne = {

	"foreignKey": {
		load: function load(pk) {
			var fpk = this.parentModel[pk][this.foreignKey];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.foreignKey] = this.relatedModel[fpk];
			}
		},

		unload: function unload(pk) {
			replaceTupel(this.parentModel[pk], this.foreignKey, this.relatedModel);
		},

		update: function (pk) {
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.foreignKey))
			if (relatedTupel == null) {
				return;
			}

			var fpk = getPrimaryKey(this.relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(this.relatedModel, fpk, relatedTupel);
		}
	},

	"foreignKeyAlias": {

		load: function load(pk) {
			var fpk = this.parentModel[pk][this.foreignKey];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.alias] = this.relatedModel[fpk];
			}
		},

		unload: function (pk) {
			this.update(pk);
			replaceTupel(this.parentModel[pk], this.foreignKey, this.relatedModel);
			delete this.parentModel[pk][this.alias];
		},

		update: function (pk) {
			var tupel = this.parentModel[pk];
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupel == null) {
				return;
			}

			var fpk = getPrimaryKey(this.relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(this.relatedModel, fpk, this.relatedTupel);
			setReferenceToRelatedModel(tupel, this.foreignKey, fpk);
		}
	},

	"throughAlias": {

		load: function load(pk) {
			var fpk = this.pivotModel[pk];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.alias] = this.relatedModel[fpk];
			}
		},

		unload: function (pk) {
			this.update(pk);
			delete this.parentModel[pk][this.alias];
		},

		update: function (pk) {
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.alias));
			var relatedModel = this.relatedModel;
			if (relatedTupel == null) {
				return;
			}

			var fpk = getPrimaryKey(relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(relatedModel, fpk, relatedTupel);
			setReferenceToRelatedModel(this.pivotModel, pk, fpk);
		}
	}
};

/**
 * Update link of a has_one relationship
 *
 * @param {Object} model		containing references
 * @param {String} key     		property name in model pointing to list of keys
 * @param {String} relatedPk	key to add
 */
function setReferenceToRelatedModel(model, key, relatedPk) {
	if (model[key] !== relatedPk) {
		// unlink other model?
		model[key] = relatedPk;
	}
}

/**
 * Remove tupel from has_one relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} foreign_key  primary key of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function replaceTupel(targetModel, foreign_key, relatedModel) {
	targetModel[foreign_key] = o.keyOf(relatedModel, targetModel[foreign_key]) || targetModel[foreign_key];
}

module.exports = hasOne;
