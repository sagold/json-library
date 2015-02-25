"use strict";

var expect = require("chai").expect;
var jsonStringifyCircular = require("../../../lib/json").stringify;


describe("jsonStringifyCircular", function () {

	var data;
	beforeEach(function () {
		data = {
			"01-01": {
				"02-01": {}
			},
			"01-02": {
				"02-02": []
			}
		};
	});

	it("should return json string", function () {
		var jsonStr = jsonStringifyCircular(data);

		expect(function () {
			JSON.parse(jsonStr)
		}).to.not.throw(Error);
	});

	it("should stringify object with circular dependencies", function () {
		data["01-01"]["02-02"] = data["01-01"];

		expect(function () {
			var jsonStr = jsonStringifyCircular(data, null, 4);
		}).to.not.throw(Error);
	});

	it("should stringify array containing circular dependencies", function () {
		data["01-02"]["02-02"].push(data["01-02"]);

		expect(function () {
			var jsonStr = jsonStringifyCircular(data, null, 4);
		}).to.not.throw(Error);
	});

	it("should replace circular dependency by pointer", function () {
		data["01-01"]["02-02"] = data["01-01"];

		var result = JSON.parse(jsonStringifyCircular(data));

		expect(result["01-01"]["02-02"]).to.eq("#/01-01");
	});

	it("should store unlinked objects as pointers", function () {
		data["01-01"]["02-02"] = data["01-01"];

		var result = JSON.parse(jsonStringifyCircular(data));

		expect(result.references["#/01-01/02-02"]).to.eq("#/01-01");
	});
});
