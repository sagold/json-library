
var expect = require("chai").expect;
var pointer = require("../../../lib/pointer");


describe("pointer.delete", function () {

	it("should delete the given property", function () {
		var result = pointer.delete({property: "propertyValue"}, "#/property");

		expect(result.property).to.be.undefined;
	});

	it("should work without starting #", function () {
		var result = pointer.delete({a: {b: {}, c: {}}}, "/a");

		expect(result.a).to.be.undefined;
	});

	it("should work for simple property", function () {
		var result = pointer.delete({a: {b: {}, c: {}}}, "a");

		expect(result.a).to.be.undefined;
	});

	it("should delete nested property only", function () {
		var result = pointer.delete({a: {b: {}, c: {}}}, "#/a/b");

		expect(result.a.b).to.be.undefined;
		expect(result.a.c).to.be.instanceOf(Object);
	});
});