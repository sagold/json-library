var expect = require("chai").expect;

var pointer = require("../../../lib/pointer"),
	join = pointer.join;


describe("pointer.join()", function () {

	it("should return a json pointer", function () {

		var pointer = join();

		expect(pointer).to.eq("#/");
	});

	it("should join multiple pointers", function () {

		var pointer = join("#/parent", "#/child", "#/target");

		expect(pointer).to.eq("#/parent/child/target");
	});

	it("should join single words to a pointer", function () {

		var pointer = join("parent", "child", "target");

		expect(pointer).to.eq("#/parent/child/target");
	});

	it("should not have multiple slashes", function () {

		var pointer = join("#", "", "first");

		expect(pointer).to.eq("#/first");
	});
});
