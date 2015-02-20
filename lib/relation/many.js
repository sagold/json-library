"use strict";
/**
 * has many relationship separated by type of relationship.
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
 * - "foreignKey"		on foreign keys
 * - "foreignKeyAlias"	on foreign keys with alias
 * - "throughAlias"		on pivot with alias
 */
var o = require("../object"),
	p = require("../pointer"),
	common = require("./common"),
	getPrimaryKey = require("./common").getPrimaryKey;


var many = {

	"foreignKey": {

		load: function load(pk) {
			var relatedModel = this.relatedModel;
			var keys = this.parentModel[pk][this.foreignKey] || [];
			this.parentModel[pk][this.foreignKey] = keys.map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},

		unload: function unload(pk) {
			replaceTupels(this.parentModel[pk], this.foreignKey, this.relatedModel);
		},

		update: Function.prototype // done
	},

	"foreignKeyAlias": {

		load: function load(pk) {
			var relatedModel = this.relatedModel;
			this.parentModel[pk][this.alias] = this.parentModel[pk][this.foreignKey].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},

		unload: function (pk) {
			this.update(pk);
			delete this.parentModel[pk][this.alias];
		},

		update: function (pk) {
			var tupel = this.parentModel[pk];
			var relatedModel = this.relatedModel;
			var foreignKey = this.foreignKey;
			var relatedTupels = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupels == null) {
				return;
			}

			// reset foreign keys
			tupel[foreignKey] = [];

			o.forEach(relatedTupels, function updateChild(child) {

				var pkOfRelatedModel = getPrimaryKey(relatedModel, child, pk);
				common.addTupelToRelatedModel(relatedModel, pkOfRelatedModel, child);
				addReferenceToRelatedModel(tupel, foreignKey, pkOfRelatedModel);
			});
		}
	},

	"throughAlias": {

		load: function (pk) {
			var relatedModel = this.relatedModel;
			this.parentModel[pk][this.alias] = this.pivotModel[pk].map(function (fpk) {
				return relatedModel[fpk] ? relatedModel[fpk] : fpk;
			});
		},

		unload: function (pk) {
			this.update(pk);
			delete this.parentModel[pk][this.alias];
		},

		update: function (pk) {
			var relatedModel = this.relatedModel;
			var pivotModel = this.pivotModel;
			var relatedTupels = p.get(this.parentModel, p.join(pk, this.alias));
			if (relatedTupels == null) {
				return;
			}

			// reset pivot
			pivotModel[pk] = [];

			o.forEach(relatedTupels, function updateChild(child) {

				var pkOfRelatedModel = getPrimaryKey(relatedModel, child, pk);
				common.addTupelToRelatedModel(relatedModel, pkOfRelatedModel, child);
				addReferenceToRelatedModel(pivotModel, pk, pkOfRelatedModel);
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
		console.log(key);
		if (key) {
			keys.push(key);
		} else {
			keys.push(value);
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
