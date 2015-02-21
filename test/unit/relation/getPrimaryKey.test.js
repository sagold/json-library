"use strict";

var expect = require("chai").expect;
var getPrimaryKey = require("../../../lib/relation/common").getPrimaryKey;


describe("getPrimaryKey", function () {

	it("should return property name of object", function () {
		var parentObject = { "propertyName": {id:"childObject"} };
		var pk = getPrimaryKey(parentObject, parentObject.propertyName);

		expect(pk).to.eq("propertyName");
	});

	it("should return given property name", function () {
		var pk = getPrimaryKey({}, {}, "defaultName");

		expect(pk).to.eq("defaultName");
	});

	it("should return value of default name", function () {
		var pk = getPrimaryKey({}, {"defaultName": "def_01"}, "defaultName");

		expect(pk).to.eq("def_01");
	});

	it("should add integer on default name if default name already exists", function () {
		var pk = getPrimaryKey({"defaultName": true}, {}, "defaultName");

		expect(pk).to.eq("defaultName_0");
	});

	it("should increase until default name does not exist ", function () {
		var pk = getPrimaryKey({"a":0, "a_0":0, "a_1": 0}, {}, "a");

		expect(pk).to.eq("a_2");
	});

	it("should return index of tupel", function () {
		var tupel = {"id": "tupel"};
		var pk = getPrimaryKey([{}, tupel], tupel, "default");

		expect(pk).to.eq(1);
	});

	it("should return array length for new tupel", function () {
		var tupel = {"id": "tupel"};
		var pk = getPrimaryKey([{}, {}, {}], tupel, "default");

		expect(pk).to.eq(3);
	});
});
