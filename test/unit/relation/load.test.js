var expect = require("chai").expect;

var load = require("../../../lib/relation/load");

describe("load", function () {

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
					first: {
						"name": "related tupel #1"
					},
					second: {
						"name": "related tupel #2"
					}
				},
				"model_relatedModel": {
					"first": "first",
					"second": "second"
				}
			}
		});

		it("should load the referenced model", function () {
			var model,
				defRelation = {
					"model": "#/model",
					"foreign_key": "related_pk",
					"references": "#/relatedModel"
				};

			var model = load(data, defRelation);

			expect(model.first.related_pk).to.eql(data.relatedModel.first);
		});

		it("should resolve the referenced model on alias", function () {
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

		it("should resolve relationship through pivot_table", function () {
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
						"related_pk": "first"
					},
					second: {
						"name": "tupel #2",
						"related_pk": "second"
					}
				},
				"relatedModel": {
					first: {
						"name": "related tupel #1"
					},
					second: {
						"name": "related tupel #2"
					},
					third: {
						"name": "related tupel #3"
					}
				},
				"model_relatedModel": {
					"first": ["first", "third"],
					"second": ["first", "second", "third"]
				},
				"invalid": {
					"first": "second",
					"second": "first"
				}
			}
		});

		it ("should load has_many relationships as array", function () {
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