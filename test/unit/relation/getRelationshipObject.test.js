"use strict";

var expect = require("chai").expect;

var getRelationshipObject = require("../../../lib/relation/getRelationshipObject");


describe("relation.createDefinitionObject", function () {

	it("should create missing pivot table'", function () {
		var data = {model:{}, related:{}};
		getRelationshipObject("model has_many:related as:rel through:model_related", data);

		expect(data).to.have.property("model_related");
	});
});

