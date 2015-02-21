"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("has_many:foreign_key", function () {

	var data, relation;

	beforeEach(function () {
		data = {
			"person": {
				"alfred": {
					"id": "alfred",
					"ears": ["large", "big"]
				}
			},
			"ears": {
				"big": {
					"id": "big"
				},
				"large": {
					"id": "large"
				},
				"broad": {
					"id": "broad"
				}
			}
		};
		// create relationship
		relation = new Relation(data, "person has_many:ears on:ears");
	});

	it("should return type has_many:foreign_key", function () {
		expect(relation.id).to.eq("has_many:foreign_key");
	});

	// load

	it("should replace all keys at foreign_key by related tupels", function () {
		relation.load("alfred");

		expect(data.person.alfred.ears.length).to.eq(2);
		expect(data.person.alfred.ears[1].id).to.eq("big");
	});

	it("should keep linked tupels intact", function () {
		relation.load("alfred");
		relation.load("alfred");

		expect(data.person.alfred.ears.length).to.eq(2);
		expect(data.person.alfred.ears[1].id).to.eq("big");
	});

	it("should update linked tupels", function () {
		relation.load("alfred");
		data.person.alfred.ears[0] = "broad";
		relation.load("alfred");

		expect(data.person.alfred.ears.length).to.eq(2);
		expect(data.person.alfred.ears[0].id).to.eq("broad");
	});

	// update

	it("should add new tupel to related model", function () {
		var id, tupel = {"id": "square"};
		data.person.alfred.ears[0] = tupel;
		relation.update("alfred");
		id = o.keyOf(data.ears, tupel);

		expect(id).to.not.be.null;
		expect(data.ears[id].id).to.eq("square");
	});

	it("should not modify foreign keys", function () {
		var id, tupel = {"id": "square"};
		data.person.alfred.ears[0] = tupel;
		relation.update("alfred");

		expect(data.person.alfred.ears[0]).to.eq(tupel);
		expect(data.person.alfred.ears[1]).to.eq("big");
	});

	// unload

	it("should reverse load", function () {
		var orig = o.copy(data);
		var relation = new Relation(data, "person has_many:ears on:ears");
		relation.load("alfred");
		relation.unload("alfred");

		expect(orig).to.deep.eq(data);
	});

	it("should update foreign keys on unload", function () {
		var relation = new Relation(data, "person has_many:ears on:ears");
		data.person.alfred.ears[0] = data.ears.broad;
		relation.unload("alfred");

		expect(data.person.alfred.ears.length).to.eq(2);
		expect(data.person.alfred.ears[0]).to.eq("broad");
		expect(data.person.alfred.ears[1]).to.eq("big");
	});
});
