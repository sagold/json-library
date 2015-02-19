var expect = require("chai").expect;

var unload = require("../../../lib/relation/unload");

describe("relation.unload", function () {

	describe("has_many", function () {

		var data;

		beforeEach(function () {

			data = {

				"model": {
					first: { "rel": null },
					second: { "rel": null },
				},
				"relatedModel": {
					first: {"name": "first related model"},
					second: {"name": "second related model"},
					third: {"name": "second related model"}
				},
				model_relatedModel: {
					first: ["first", "third"],
					second: ["second"]
				}
			};
			// link model model.first -> relatedModel.second
			data.model.first.rel = [data.relatedModel.first, data.relatedModel.third];
			data.model.second.rel = [data.relatedModel.second];
		});

		it("should replace linked objects with keys", function () {
			var defRelation = "model has_many:relatedModel on:rel";
			var model = unload(data, defRelation);

			expect(model.first.rel.length).to.eq(2);
			expect(model.first.rel[1]).to.eq("third");
		});

		it("should remove alias for has_many relationship", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"foreign_key": "rel",
				"alias": "rel",
				"type": "has_many"
			};

			var model = unload(data, defRelation);

			expect(model.first.rel).to.be.undefined;
			expect(model.second.rel).to.be.undefined;
		});

		it("should remove alias for has_many-through relationship", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"through": "model_relatedModel",
				"alias": "rel",
				"type": "has_many"
			};

			var model = unload(data, defRelation);

			expect(model.first.rel).to.be.undefined;
			expect(model.second.rel).to.be.undefined;
		});
	});

	describe("has_one", function () {

		var data;

		beforeEach(function () {

			data = {

				"model": {
					first: {
						"rel": null
					}
				},
				"relatedModel": {
					first: {"name": "first related model"},
					second: {"name": "second related model"}
				},
				"model_relatedModel": {
					"first": "second"
				}
			};
			// link model model.first -> relatedModel.second
			data.model.first.rel = data.relatedModel.second;
		});

		it("should replace linked object with its primary_key", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"foreign_key": "rel"
			};

			var model = unload(data, defRelation);

			expect(model.first.rel).to.eq("second");
		});

		it("should replace linked object through pivot table", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"through": "model_relatedModel",
				"alias": "rel"
			};

			var model = unload(data, defRelation);

			expect(model.first.rel).to.eq("second");
		});

		it("should remove alias completely", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"foreign_key": "rel",
				"alias": "rel"
			};

			var model = unload(data, defRelation);

			expect(model.first.rel).to.be.undefined;
		});

		it("should update pivot tables", function () {
			var defRelation = {
				"model": "#/model",
				"references": "relatedModel",
				"through": "model_relatedModel",
				"alias": "rel"
			};
			// link model model.second -> relatedModel.first
			data.model = {
				"first": {
					"rel": data.relatedModel.second
				},
				"second": {
					"rel": data.relatedModel.second
				}
			};

			unload(data, defRelation);

			expect(data["model_relatedModel"].first).to.eql("second");
			expect(data["model_relatedModel"].second).to.eql("second");
		});
	});
});