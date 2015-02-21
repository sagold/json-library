"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("has_many:foreign_key:alias", function () {

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
		relation = new Relation(data, "person has_many:ears as:feet on:ears");
	});

	it("should return type has_many:foreign_key:alias", function () {
		expect(relation.id).to.eq("has_many:foreign_key:alias");
	});

	// load

	it("should link all tupels specified in foreign_key on alias", function () {
		relation.load("alfred");

		expect(data.person.alfred.feet.length).to.eq(2);
		expect(data.person.alfred.feet[1].id).to.eq("big");
	});

	it("should keep linked tupels intact", function () {
		relation.load("alfred");
		relation.load("alfred");

		expect(data.person.alfred.feet.length).to.eq(2);
		expect(data.person.alfred.feet[1].id).to.eq("big");
	});

	it("should load new tupel", function () {
		relation.load("alfred");
		data.person.alfred.ears[2] = "broad";
		relation.load("alfred");

		expect(data.person.alfred.feet.length).to.eq(3);
		expect(data.person.alfred.feet[2].id).to.eq("broad");
	});

	// update

	it("should add new tupel to related model", function () {
		var id, tupel = {"id": "square"};
		data.person.alfred.feet = [tupel];
		relation.update("alfred");
		id = o.keyOf(data.ears, tupel);

		expect(id).to.not.be.null;
		expect(data.ears[id].id).to.eq("square");
	});

	it("should update foreign keys", function () {
		var id, tupel = {"id": "square"};
		data.person.alfred.feet = [tupel];
		relation.update("alfred");
		id = o.keyOf(data.ears, tupel);

		expect(id).to.not.be.null;
		expect(data.person.alfred.ears.length).to.eq(1);
		expect(data.person.alfred.ears[0]).to.eq(id);
	});

	// unload

	it("should reverse load", function () {
		var orig = o.copy(data);
		relation.load("alfred");
		relation.unload("alfred");

		expect(orig).to.deep.eq(data);
	});

	it("should update foreign keys on unload", function () {

		data.person.alfred.feet = [data.ears.broad, data.ears.big];
		relation.unload("alfred");

		expect(data.person.alfred.ears.length).to.eq(2);
		expect(data.person.alfred.ears[0]).to.eq("broad");
		expect(data.person.alfred.ears[1]).to.eq("big");
	});
});