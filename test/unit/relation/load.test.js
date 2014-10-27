var expect = require("chai").expect;

var load = require("../../../lib/relation/load");

describe("relation.load", function () {

	describe("has_one", function () {

		var data;

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

		it("should resolve to foreign_key", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"foreign_key": "related_pk",
					"references": "#/relatedModel"
				};

			var model = load(data, defRelation);

			expect(model.first.related_pk).to.eql(data.relatedModel.first);
		});

		it("should resolve to alias", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"foreign_key": "related_pk",
					"alias": "relationship",
					"references": "#/relatedModel"
				};

			var model = load(data, defRelation);

			expect(model.first.relationship).to.eql(data.relatedModel.first);
		});

		it("should resolve by pivot table", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"through": "model_relatedModel",
					"alias": "relationship",
					"references": "#/relatedModel"
				};

			var model = load(data, defRelation);

			expect(model.first.relationship).to.eql(data.relatedModel.first);
		});
	});

	describe("has_many", function () {

		var data;

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
				model_relatedModel: {
					first: ["first", "third"],
					second: ["first", "second", "third"]
				}
			}
		});

		it("should load object within foreign_key array", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"foreign_key": "rel",
					"references": "#/relatedModel",
					"type": "has_many"
				};

			var model = load(data, defRelation);

			expect(model.first.rel.length).to.eql(2);
			expect(model.first.rel[1]).to.eql(data.relatedModel.third);
		});

		it ("should resolve array through pivot table", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"through": "model_relatedModel",
					"alias": "rel",
					"references": "#/relatedModel",
					"type": "has_many"
				};

			var model = load(data, defRelation);

			expect(model.first.rel.length).to.eql(2);
			expect(model.second.rel.length).to.eql(3);
			expect(model.first.rel[1]).to.eql(data.relatedModel.third);
		});
	});
});