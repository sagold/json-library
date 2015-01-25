var expect = require("chai").expect;

var convert = require("../../../lib/schema").convert;


describe("schema.convert", function () {

	var schema;

	beforeEach(function () {

		schema = {

			"type": "object",
			"properties": {
				parent: {
					id: "parent",
					type: "object"
				},
				child: {
					id: "child",
					type: "object"
				}
			}
		};
	});

	it("should return a new schema object", function () {
		var converted = convert(schema, {});

		expect(converted).to.be.an("object");
		expect(converted === schema).to.be.false;
	});

	it("should move related model schema to parent model", function () {
		var converted = convert(schema, {
			model: "#/parent",
			references: "#/child",
			alias: "children",
			type: "has_many"
		});

		expect(converted.properties.parent.properties.children).to.be.an("object");
	});
});