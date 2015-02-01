"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object");

describe("object.forEach", function () {

	it("should callback on all object properties", function () {
		var result = [];
		o.forEach({
			"first": {
				name: "first"
			},
			"second": {
				name: "second"
			}
		}, function (key) {
			result.push(key);
		});

		expect(result).to.deep.equal(["first", "second"]);
	});

	it("should callback on all array items", function () {
		var result = [];
		o.forEach(["a", "b", "e"], function (key) {
			result.push(key);
		});

		expect(result).to.deep.equal(["a", "b", "e"]);
	});

	it("should callback with property, value, object", function () {
		var result = [],
			data = {
				"first": {name: "first"}, "second": {name: "second"}
			};

		o.forEach(data, function (property, value, object) {
			result.push(arguments);
		});

		expect(result.length).to.eq(2);
		expect(result[0][0]).to.eq("first");
		expect(result[0][1]).to.deep.eq({name: "first"});
		expect(result[0][2]).to.eq(data);
	});
});