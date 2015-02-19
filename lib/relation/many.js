"use strict";

var o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	getPrimaryKey = require("./common").getPrimaryKey;


var many = {

	"throughAlias": {
		/**
		 * apply a relationship, assigning relatedModels on parentModel's alias
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		load: function (pk) {
			var relatedModel = this.relatedModel;
			this.parentModel[pk][this.alias] = this.pivotModel[pk].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function (pk) {
			delete this.parentModel[pk][this.alias];
		},
		/**
		 * update pivots by linked related models
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		update: function (pk) {
			var relatedModel = this.relatedModel;
			var pivotModel = this.pivotModel;
			var relatedTupels = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupels == null) {
				return;
			}

			o.forEach(relatedTupels, function updateChild(child) {

				var pkOfRelatedModel = getPrimaryKey(relatedModel, child, pk);
				common.addTupelToRelatedModel(relatedModel, pkOfRelatedModel, child);
				addReferenceToRelatedModel(pivotModel, pk, pkOfRelatedModel);
			});
		}
	},

	"foreignKey": {
		/**
		 * apply a relationship, assigning relatedModels on parentModel's foreign_key array
		 *
		 * @param  {[type]} r       [description]
		 * @param  {[type]} tupelPk [description]
		 * @return {[type]}         [description]
		 */
		load: function load(pk) {
			var relatedModel = this.relatedModel;
			var keys = this.parentModel[pk][this.foreignKey] || [];
			this.parentModel[pk][this.foreignKey] = keys.map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function unload(pk) {
			replaceTupels(this.parentModel[pk], this.foreignKey, this.relatedModel);
		},

		update: function () {} // done
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
			var relatedModel = this.relatedModel;
			this.parentModel[pk][this.alias] = this.parentModel[pk][this.foreignKey].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},
		/**
		 * reverse load, unlinking relaetionship and related objects
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		unload: function (pk) {
			delete this.parentModel[pk][this.alias];
		},
		/**
		 * update pivots by linked related models
		 *
		 * @param  {String} pk	of relationship owner tupel to unload
		 */
		update: function (pk) {
			var tupel = this.parentModel[pk];
			var relatedModel = this.relatedModel;
			var foreignKey = this.foreignKey;
			var relatedTupels = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupels == null) {
				return;
			}

			o.forEach(relatedTupels, function updateChild(child) {

				var pkOfRelatedModel = getPrimaryKey(relatedModel, child, pk);
				common.addTupelToRelatedModel(relatedModel, pkOfRelatedModel, child);
				addReferenceToRelatedModel(tupel, foreignKey, pkOfRelatedModel);
			});
		}
	}
};

/**
 * Remove tupels from has_many relationship
 *
 * @param {Object|Array} targetModel	model which owns relationship
 * @param {String|Integer} foreign_key  primary key of tupel in foreign model
 * @param {Object|Array} relatedModel	foreign model
 */
function replaceTupels(targetModel, foreign_key, relatedModel) {
	var key, keys;

	if (!Array.isArray(targetModel[foreign_key]) || targetModel[foreign_key].length === 0) {
		return;
	}

	keys = [];
	targetModel[foreign_key].forEach(function (value) {
		key = o.keyOf(relatedModel, value);
		if (key) {
			keys.push(key);
		}
	});

	targetModel[foreign_key] = keys;
}

/**
 * Adds a related pk to a list of references, ensuring the list is an array with unique elements
 *
 * @param  {Object} model
 * @param  {String} key   		property name in model pointing to list of keys
 * @param  {String} relatedPk 	key to add
 */
function addReferenceToRelatedModel(model, key, relatedPk) {
	if (!Array.isArray(model[key])) {
		model[key] = o.asArray(model[key]);
	}

	if (model[key].indexOf(relatedPk) === -1) {
		model[key].push(relatedPk);
	}
}

module.exports = many;
