var expect = require("chai").expect;

var get = require("../../../lib/schema").get;


describe("schema.get", function () {

	var schema;

	beforeEach(function () {

		schema = {

			"type": Object,
			"properties": {
				parent: {
					"id": "parent"
				},
				child: {
					"id": "child",
					"properties": {
						item: {
							"type": String
						}
					}
				}
			}
		};
	});

	it("should return from properties", function () {
		var target = get("#/parent", schema);

		expect(target.id).to.eql("parent");
	});

	it("should return from nested properties", function () {
		var target = get("#/child/item", schema);

		expect(target.type).to.eql(String);
	});
});