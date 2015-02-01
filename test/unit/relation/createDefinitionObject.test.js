"use strict";

var expect = require("chai").expect;

var create = require("../../../lib/relation/createDefinitionObject");


describe("relation.createDefinitionObject", function () {

	it("should resolve to 'has_one:foreign_key'", function () {

		var result = create("#/article has_one:#/related on:foreign_key");

		expect(result.model).to.eq("#/article");
		expect(result.type).to.eq("has_one");
		expect(result.references).to.eq("#/related");
		expect(result.foreign_key).to.eq("foreign_key");
	});

	it("should resolve 'as' to 'alias'", function () {

		var result = create("#/article has_one:#/related as:link on:foreign_key");

		expect(result.alias).to.eq("link");
		expect(result.foreign_key).to.eq("foreign_key");
	});

	it("should resolve to 'has_one:through:alias'", function () {

		var result = create("#/article has_one:#/related as:link through:#/pivot/table");

		expect(result.through).to.eq("#/pivot/table");
		expect(result.alias).to.eq("link");
	});

	it("should resolve to 'has_many:through:alias'", function () {

		var result = create("#/article has_many:#/related as:links through:#/pivot/table");

		expect(result.model).to.eq("#/article");
		expect(result.type).to.eq("has_many");
		expect(result.references).to.eq("#/related");
		expect(result.through).to.eq("#/pivot/table");
		expect(result.alias).to.eq("links");
	});

	it("should resolve to 'has_many:foreign_key:alias'", function () {

		var result = create("#/article has_many:#/related on:link_pks as:links");

		expect(result.foreign_key).to.eq("link_pks");
		expect(result.alias).to.eq("links");
	});

	it("should resolve to 'has_many:foreign_key'", function () {

		var result = create("#/article has_many:#/related on:links");

		expect(result.foreign_key).to.eq("links");
	});
});
