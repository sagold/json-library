"use strict";

var expect = require("chai").expect;


var query = require("../../../lib/query"),
	valid = query.valid;


describe("valid", function () {

	it("should return false if query fails", function () {
		var is_valid = valid({}, "type:var");

		expect(is_valid).to.be.false;
	});

	it("should return true if query has matches", function () {
		var is_valid = valid({

			"type": true

		}, "type:true");

		expect(is_valid).to.be.true;
	});

	it("should match booleans", function () {
		var is_valid = valid({

			"type": false

		}, "type:false");

		expect(is_valid).to.be.true;
	});

	it("should tests multiple properties", function () {
		var is_valid = valid({

			"type": "var",
			"init": false

		}, "type:var&init:false");

		expect(is_valid).to.be.true;
	});

	it("should test for null", function () {
		var is_valid = valid({

			"type": null,

		}, "type:null");

		expect(is_valid).to.be.true;
	});

	it("should negate comparison on leading !", function () {
		var is_valid = valid({

			"type": true,
			"init": false

		}, "init:!true&type:!funny");

		expect(is_valid).to.be.true;
	});

	it("should fail on negated comparison", function () {
		var is_valid = valid({

			"type": true

		}, "type:!true");

		expect(is_valid).to.be.false;
	});

	it("should return false if a single match fails", function () {
		var is_valid = valid({

			"type": "var",
			"init": false

		}, "type:var&init:false&init:!false");

		expect(is_valid).to.be.false;
	});

	it("should validate undefined", function () {
		var is_valid = valid({}, "init:undefined");

		expect(is_valid).to.be.true;
	});
});
