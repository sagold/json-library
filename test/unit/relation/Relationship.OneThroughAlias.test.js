"use strict";

var expect = require("chai").expect;

var json = require("../../../lib/json"),
	o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("has_one:through:alias", function () {

	var data, relation;


	beforeEach(function () {
		// create new data object
		data = {
			"person": {
				"alfred": {
					"id": "alfred"
				}
			},
			"nose": {
				"big": {
					"id": "big"
				},
				"large": {
					"id": "large"
				}
			},
			"person_nose": {
				"alfred": "large"
			}
		};
		// create relationship
		relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
	});

	it("should return type has_one:through:alias", function () {
		expect(relation.id).to.eq("has_one:through:alias");
	});

	// load

	it("should add linked tupel in pivot to parent tupel", function () {
		relation.load("alfred");

		expect(data.person.alfred.nose.id).to.eq("large");
	});

	it("should keep linked tupel intact", function () {
		relation.load("alfred");
		relation.load("alfred");

		expect(data.person.alfred.nose.id).to.eq("large");
	});

	it("should replace loaded tupel", function () {
		relation.load("alfred");
		data.person_nose.alfred = "big";
		relation.load("alfred");

		expect(data.person.alfred.nose.id).to.eq("big");
	});

	// update

	it("should add new tupel to related model", function () {
		var id, tupel = {"id": "broad"};
		data.person.alfred.nose = tupel;
		relation.update("alfred");
		id = o.keyOf(data.nose, tupel);

		expect(id).to.not.be.null;
		expect(data.nose[id].id).to.eq("broad");
	});

	it("should update pivot", function () {
		var id, tupel = {"id": "broad"};
		data.person.alfred.nose = tupel;
		relation.update("alfred");
		id = o.keyOf(data.nose, tupel);

		expect(id).to.not.be.null;
		expect(data.person_nose.alfred).to.eq(id);
	});

	// unload

	it("should reverse load", function () {
		var orig = json.copy(data);
		var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
		relation.load("alfred");
		relation.unload("alfred");

		expect(orig).to.deep.eq(data);
	});

	it("should update pivot table on unload", function () {
		var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
		data.person.alfred.nose = data.nose.big;
		relation.unload("alfred");

		expect(data.person_nose.alfred).to.eq("big");
	});
});
