"use strict";

var o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	getPrimaryKey = require("./common").getPrimaryKey;


var hasOne = {

	"foreignKey": {
		/**
		 * apply a relationship, assigning relatedModels on parentModel's foreign_key
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		load: function load(pk) {
			var fpk = this.parentModel[pk][this.foreignKey];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.foreignKey] = this.relatedModel[fpk];
			}
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function unload(pk) {
			replaceTupel(this.parentModel[pk], this.foreignKey, this.relatedModel);
		},
		/**
		 * updates foreign key by related model
		 *
		 * @param  {String} pk	of relationship owner tupel to update
		 */
		update: function (pk) {
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.foreignKey))
			if (relatedTupel == null) {
				return;
			}

			var pkOfRelatedModel = getPrimaryKey(this.relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(this.relatedModel, pkOfRelatedModel, relatedTupel);
		}
	},

	"foreignKeyAlias": {
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		load: function load(pk) {
			var fpk = this.parentModel[pk][this.foreignKey];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.alias] = this.relatedModel[fpk];
			}
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function (pk) {
			var model = this.parentModel;
			var alias = this.alias;
			var foreignKey = this.foreignKey;
			var relatedModel = this.relatedModel;
			o.forEach(model, function (pk, tupel) {
				replaceTupel(tupel, foreignKey, relatedModel);
				delete tupel[alias];
			});
		},
		/**
		 * updates foreign key by related model
		 *
		 * @param  {String} pk	of relationship owner tupel to update
		 */
		update: function (pk) {
			var tupel = this.parentModel[pk];
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupel == null) {
				return;
			}

			var pkOfRelatedModel = getPrimaryKey(this.relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(this.relatedModel, pkOfRelatedModel, this.relatedTupel);
			setReferenceToRelatedModel(tupel, this.foreignKey, pkOfRelatedModel);
		}
	},

	"throughAlias": {
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias or foreign_key
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		load: function load(pk) {
			var fpk = this.pivotModel[pk];
			if (this.relatedModel[fpk]) {
				this.parentModel[pk][this.alias] = this.relatedModel[fpk];
			}
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function (pk) {
			var model = this.parentModel;
			var alias = this.alias;
			var pivot = this.pivotModel;
			o.forEach(model, function (pk) {
				model[pk][alias] = pivot[pk];
			});
		},
		/**
		 * updates foreign key by related model
		 *
		 * @param  {String} pk	of relationship owner tupel to update
		 */
		update: function (pk) {
			var relatedTupel = p.get(this.parentModel, p.join(pk, this.alias));
			var relatedModel = this.relatedModel;
			if (relatedTupel == null) {
				return;
			}

			var pkOfRelatedModel = getPrimaryKey(relatedModel, relatedTupel, pk);
			common.addTupelToRelatedModel(relatedModel, pkOfRelatedModel, relatedTupel);
			setReferenceToRelatedModel(this.pivotModel, pk, pkOfRelatedModel);
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
