var expect = require("chai").expect;

var relation = require("../../../lib/relation");


describe("relation", function () {

	describe("validate", function () {

		it("should return false if definition is empty", function () {

			expect(relation.validate()).to.be.false;
		});

		it("should return false for invalid relationship", function () {
			var defRelation = {
				"model": "#/model",
				"references": "#/relatedModel"
			};

			expect(relation.validate(defRelation)).to.be.false;
		});

		it("should return true for valid relationship", function () {
			var defRelation = {
				"model": "#/model",
				"references": "#/relatedModel",
				"foreign_key": "related_pk"
			};

			expect(relation.validate(defRelation)).to.be.true;
		});

		it("should return true for valid through relationship", function () {
			var defRelation = {
				"model": "#/model",
				"references": "#/relatedModel",
				"through": "model_relatedModel",
				"alias": "related"
			};

			expect(relation.validate(defRelation)).to.be.true;
		});
	});


	describe("validate with model", function () {

		it("should return false model is not found", function () {
			var defRelation = {
					"model": "#/model",
					"references": "#/relatedModel",
					"foreign_key": "related_pk"
				},
				data = {
					"model": {}
				};

			result = relation.validate(defRelation, data);

			expect(result).to.be.false;
		});

		it("should return true models are valid", function () {
			var defRelation = {
					"model": "#/model",
					"references": "#/relatedModel",
					"foreign_key": "related_pk"
				},
				data = {
					"model": {},
					"relatedModel": {}
				};

			result = relation.validate(defRelation, data);

			expect(result).to.be.true;
		});
	});
});
