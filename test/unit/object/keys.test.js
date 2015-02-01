"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object");

describe("object.keys", function () {

	it("should return keys of an object", function () {
		var data = {
			"first": {"name": "first"},
			"second": {"name": "second"}
		};

		var keys = o.keys(data);

		expect(keys.length).to.eql(2);
		expect(keys[0]).to.eql("first");
		expect(keys[1]).to.eql("second");
	});

	it("should return keys of an array", function () {
		var data = [1, "3", 4];

		var keys = o.keys(data);

		expect(keys.length).to.eql(3);
		expect(keys[0]).to.eql(0);
		expect(keys[1]).to.eql(1);
		expect(keys[2]).to.eql(2);
	});

	it("should return always return an array", function () {

		var keys = o.keys();

		expect(keys.length).to.eql(0);
		expect(keys).to.be.an.array;
	});
});
