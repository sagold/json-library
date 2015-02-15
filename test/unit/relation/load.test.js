var expect = require("chai").expect;

var load = require("../../../lib/relation/load");

describe("relation.load", function () {

	var data;

	describe("has_one", function () {

		beforeEach(function () {
			data = {
				"model": {
					first: {
						"name": "tupel #1",
						"related_pk": "first"
					},
					second: {
						"name": "tupel #2",
						"related_pk": "second"
					}
				},
				"relatedModel": {
					first: {"name": "related tupel #1"},
					second: {"name": "related tupel #2"},
					third: {"name": "related tupel #3"}
				},
				model_relatedModel: {
					first: "first",
					second: "second"
				}
			}
		});

		describe("foreign key", function () {

			it("should resolve on foreign_key", function () {
				var model = load(data, "model has_one:relatedModel on:related_pk");

				expect(model.first.related_pk).to.eql(data.relatedModel.first);
			});

			it("should ignore already linked model", function () {
				var model, relation = "model has_one:relatedModel on:related_pk";
				model = load(data, relation);

				expect(model.first.related_pk).to.eql(data.relatedModel.first);
			});

			it("should resolve to alias", function () {
				var model = load(data, "model has_one:relatedModel as:relationship on:related_pk");

				expect(model.first.relationship).to.eql(data.relatedModel.first);
			});

			it("should replace model on alias", function () {
				var model, relation = "model has_one:relatedModel as:relationship on:related_pk";
				model = load(data, relation);
				model.first.related_pk = "second";
				model = load(data, relation);

				expect(model.first.relationship).to.eql(data.relatedModel.second);
			});
		});

		describe("pivot table", function () {

			it("should resolve on alias", function () {
				var model = load(data, "model has_one:relatedModel as:relationship through:model_relatedModel");

				expect(model.first.relationship).to.eql(data.relatedModel.first);
			});

			it ("should replace current link of pivot on alias", function () {
				var model, relation = "model has_one:relatedModel as:relationship through:model_relatedModel"
				load(data, relation);
				data.model_relatedModel.first = "second";

				model = load(data, relation);

				expect(model.first.relationship).to.eql(data.relatedModel.second);
			});
		});
	});

	describe("has_many", function () {

		beforeEach(function () {
			data = {
				"model": {
					first: {
						"name": "tupel #1",
						"rel": ["first", "third"]
					},
					second: {
						"name": "tupel #2",
						"rel": ["first", "second", "third"]
					}
				},
				"relatedModel": {
					first: {"name": "related tupel #1"},
					second: {"name": "related tupel #2"},
					third: {"name": "related tupel #3"}
				},
				"model_relatedModel": {
					first: ["first", "third"],
					second: ["first", "second", "third"]
				}
			}
		});

		describe("foreign key", function () {

			it("should replace keys by related objects", function () {
				var model = load(data, "model has_many:relatedModel on:rel");

				expect(model.first.rel.length).to.eql(2);
				expect(model.first.rel[1]).to.eql(data.relatedModel.third);
			});

			it("should add related objects to alias", function () {
				var model = load(data, "model has_many:relatedModel as:alias on:rel");

				expect(model.first.alias.length).to.eql(2);
				expect(model.first.alias[1]).to.eql(data.relatedModel.third);
			});

			it("should replace related objects of alias", function () {
				var relation = "model has_many:relatedModel as:alias on:rel";
				model = load(data, relation);
				model.first.rel = ["first", "second"];
				model = load(data, relation);

				expect(model.first.alias.length).to.eql(2);
				expect(model.first.alias[0]).to.eql(data.relatedModel.first);
				expect(model.first.alias[1]).to.eql(data.relatedModel.second);
			});
		});

		describe("pivot table", function () {

			it ("should add related objects to alias", function () {
				var model = load(data, "model has_many:relatedModel as:links through:model_relatedModel");

				expect(model.first.links.length).to.eql(2);
				expect(model.second.links.length).to.eql(3);
				expect(model.first.links[1]).to.eql(data.relatedModel.third);
			});

			it ("should replace related objects on alias", function () {
				var model, relation = "model has_many:relatedModel as:links through:model_relatedModel"
				load(data, relation);
				data.model_relatedModel.first = ["second"];

				model = load(data, relation);

				expect(model["first"].links.length).to.eq(1);
				expect(model["first"].links[0]).to.eq(data.relatedModel.second);
			});
		});
	});
});