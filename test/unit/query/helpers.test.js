var expect = require("chai").expect;

var o = require("../../../lib/object");
	query = require("../../../lib/query");
	filter = query.filter,
	valid = query.valid;


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
		var result = filter(obj, "*|type:true");

		expect(result.length).to.eq(2);
		expect(result[1]).to.eq(obj.second);
	});

	it("should return object as array", function () {
		var result = filter(obj, "first|type:true");

		expect(result.length).to.eq(1);
		expect(result[0]).to.eq(obj.first);
	});

	// it.only("should return objects with type defined", function () {
	// 	var result = filter(arr, "*|type!null");
	// 	console.log(result);
	// 	expect(result.length).to.eq(2);
	// 	expect(result[1]).to.eq(arr[1]);
	// });

	it("should return empty array if nothing found", function () {
		var result = filter(obj, "*|type:false");

		expect(result.length).to.eq(0);
	});

	it("should return empty array if no selector", function () {
		var result = filter(obj);

		expect(result.length).to.eq(0);
	});

	it("should return empty array if object invalid", function () {
		var result = filter(obj, "first|type:false");

		expect(result.length).to.eq(0);
	});

	it("should return empty array if property not found", function () {
		var result = filter(obj, "first|type:false");

		expect(result.length).to.eq(0);
	});

		it("should query * in array", function () {
			var result = filter(arr, "*|type:true");

			expect(result.length).to.eq(2);
		});

		it("should return empty array for input array", function () {
			var result = filter(arr, "first|type:true");

			expect(result.length).to.eq(0);
		});

		it("should return index in array", function () {
			var result = filter(arr, "1");

			expect(result.length).to.eq(1);
			expect(result[0]).to.eq(arr[1]);
		});

		it("should query index in array", function () {
			var result = filter(arr, "1|type:true");

			expect(result.length).to.eq(1);
			expect(result[0].id).to.eq("second");
		});
});

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
