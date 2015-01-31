"use strict";

var expect = require("chai").expect;


var query = require("../../../lib/query"),
	filter = query.filter;


describe("filter", function () {

	var obj, arr;

	beforeEach(function () {

		obj = {
			"first": { "type": true },
			"second": { "type": true },
			"third": [
				{ "type": "inThird" },
				{ "type": "secondInThird" },
				{ "type": null}
			],
			"id": "obj"
		};

		arr = [
			{ "id": "first", "type": true },
			{ "id": "second", "type": true },
			{
				"id": "third",
				"values": [
					{ "type": "inThird" },
					{ "type": "secondInThird" },
				]
			}
		];
	});

	it("should return all direct elements", function () {
		var result = filter(obj, "*");

		expect(result.length).to.eq(4);
	});

	it("should return all elements", function () {
		var result = filter(obj, "**");

		expect(result.length).to.eq(4);
	});

	it("should return selected element", function () {
		var result = filter(obj, "first");

		expect(result.length).to.eq(1);
		expect(result[0]).to.eq(obj.first);
	});

	it("should return all matched elements", function () {
		var result = filter(obj, "*?type:true");

		expect(result.length).to.eq(2);
		expect(result[1]).to.eq(obj.second);
	});

	it("should return object as array", function () {
		var result = filter(obj, "first?type:true");

		expect(result.length).to.eq(1);
		expect(result[0]).to.eq(obj.first);
	});

	// it.only("should return objects with type defined", function () {
	// 	var result = filter(arr, "*?type!null");
	// 	console.log(result);
	// 	expect(result.length).to.eq(2);
	// 	expect(result[1]).to.eq(arr[1]);
	// });

	it("should return empty array if nothing found", function () {
		var result = filter(obj, "*?type:false");

		expect(result.length).to.eq(0);
	});

	it("should return empty array if no selector", function () {
		var result = filter(obj);

		expect(result.length).to.eq(0);
	});

	it("should return empty array if object invalid", function () {
		var result = filter(obj, "first?type:false");

		expect(result.length).to.eq(0);
	});

	it("should return empty array if property not found", function () {
		var result = filter(obj, "first?type:false");

		expect(result.length).to.eq(0);
	});

		it("should query * in array", function () {
			var result = filter(arr, "*?type:true");

			expect(result.length).to.eq(2);
		});

		it("should return empty array for input array", function () {
			var result = filter(arr, "first?type:true");

			expect(result.length).to.eq(0);
		});

		it("should return index in array", function () {
			var result = filter(arr, "1");

			expect(result.length).to.eq(1);
			expect(result[0]).to.eq(arr[1]);
		});

		it("should query index in array", function () {
			var result = filter(arr, "1?type:true");

			expect(result.length).to.eq(1);
			expect(result[0].id).to.eq("second");
		});
});