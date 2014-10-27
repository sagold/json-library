var expect = require("chai").expect;

var pointer = require("../../../lib/pointer");


describe("pointer", function () {

	describe("get", function () {

		it("should return property", function () {
			var result = pointer.get("/property", {property: "propertyValue"});

			expect(result).to.eq("propertyValue")
		});

		it("should return null if property does not exist", function () {
			var result = pointer.get("/value", {property: "propertyValue"});

			expect(result).to.be.null;
		});

		it("should return null if pointer is empty", function () {
			var result = pointer.get(null, {property: "propertyValue"});

			expect(result).to.be.null;
		});

		it("should ignore leading #", function () {
			var result = pointer.get("#/property", {property: "propertyValue"});

			expect(result).to.eq("propertyValue")
		});

		it("should return nested properties", function () {
			var result = pointer.get("#/property/value", {property: {value: "propertyValue"}});

			expect(result).to.eq("propertyValue")
		});

		it("should resolve arrays", function () {
			var result = pointer.get("#/1/value", ["0", {value: "propertyValue"}]);

			expect(result).to.eq("propertyValue")
		});
	});
});