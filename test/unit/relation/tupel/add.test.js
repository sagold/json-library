"use strict";

var expect = require("chai").expect;

var add = require("../../../../lib/relation/tupel/add");


describe("relation.tupel.add", function () {

	var data;

	beforeEach(function () {
		data = {
			"companies": {
				"abc": {
					"id": "abc",
					"epk": ["alpha01", "alpha02"],
					"employees": []
				},
				"def": {
					"id": "def",
					"epk": ["alpha01", "alpha03"],
					"employees": []
				}
			},
			"employees": {
				"alpha01": {"id": "alpha01"},
				"alpha02": {"id": "alpha02"},
				"alpha03": {"id": "alpha03"}
			}
		};
	});

	it("should add related tupel to parent tupel", function () {
		add(data, "companies has_many:employees as:employees on:epk", "abc", "alpha03");

		console.log(data);

		expect(data.companies.abc.epk.length).to.eq(3);
		expect(data.companies.abc.employees[2]).to.eq(data.employees.alpha03);
	});
});
