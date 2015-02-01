"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object");

describe("object.values", function () {

	it("should return all values of an object", function () {
		var data = {
			"first": {"name": "first"},
			"second": "name"
		};

		var values = o.values(data);

		expect(values.length).to.eql(2);
		expect(values[0]).to.eql(data.first);
		expect(values[1]).to.eql(data.second);
	});

	it("should return all values of an array", function () {
		var data = [{ "name": "first" }, "a", 4];

		var values = o.values(data);

		expect(values.length).to.eql(3);
		expect(values).to.eql(data);
	});

	it("should return an array for non objects", function () {

		var values = o.values("data");

		expect(values.length).to.eql(1);
		expect(values).to.eql(["data"]);
	});

	it("should always return an array", function () {

		var values = o.values();

		expect(values.length).to.eql(0);
		expect(values).to.be.an.array;
	});
});
