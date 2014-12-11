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

	describe("set", function () {

		it("should add value to the given property", function () {
			var result = pointer.set("#/property", {}, true);

			expect(result).to.have.property("property");
			expect(result.property).to.be.true;
		});

		it("should add value on the given path", function () {
			var result = pointer.set("#/path/to/property", {}, true);

			expect(result.path.to.property).to.be.true
		});

		it("should add not remove any other properties", function () {
			var result = pointer.set("#/path/to/property", {
				"path": { "to": { "id": "parent"} }
			}, true);

			expect(result.path.to.property).to.be.true
			expect(result.path.to.id).to.eq("parent");
		});
	})
});