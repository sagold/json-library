"use strict";

var expect = require("chai").expect;
var constants = require("../../../lib/object/constants"),
	jsonParseCircular = require("../../../lib/object").stringify,
	jsonStringifyCircular = require("../../../lib/json").parse;


describe("jsonParseCircular", function () {

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
		// create circular link
		data["01-01"]["02-02"] = data["01-01"];
		data["01-02"]["02-02"].push(data["01-02"]);
		data = jsonStringifyCircular(data);
	});

	it("should return json", function () {
		var json = jsonParseCircular(data);

		expect(json).to.be.an.object;
		expect(json["01-01"]).to.have.property("02-01");
	});

	it("should restore circular dependencies", function () {
		var json = jsonParseCircular(data);

		expect(json["01-01"]["02-02"]).to.eq(json["01-01"]);
		expect(json["01-02"]["02-02"][0]).to.eq(json["01-02"]);
	});

	it("should remove reference object", function () {
		var json = jsonParseCircular(data);

		expect(json[constants.REFERENCE_LOCATION]).to.be.undefined;
	});
});
