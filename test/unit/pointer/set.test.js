var expect = require("chai").expect;

var pointer = require("../../../lib/pointer");


describe("pointer.set", function () {

	it("should add value to the given property", function () {
		var result = pointer.set({}, "#/property", true);

		expect(result).to.have.property("property");
		expect(result.property).to.be.true;
	});

	it("should add value on the given path", function () {
		var result = pointer.set({}, "#/path/to/property", true);

		expect(result.path.to.property).to.be.true
	});

	it("should add not remove any other properties", function () {
		var result = pointer.set({
			"path": { "to": { "id": "parent"} }
		}, "#/path/to/property", true);

		expect(result.path.to.property).to.be.true
		expect(result.path.to.id).to.eq("parent");
	});
});
