"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object");

describe("object.keyOf", function () {

	it("should return the property of needle", function () {
		var data = {
			"first": {"name": "first"},
			"second": {"name": "second"}
		};

		var key = o.keyOf(data, data.second);

		expect(key).to.eql("second");
	});

	it("should return null of not found", function () {
		var data = {
			"first": {"name": "first"},
			"second": {"name": "second"}
		};

		var key = o.keyOf(data, {});

		expect(key).to.be.null;
	});
});
