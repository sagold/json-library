"use strict";

var expect = require("chai").expect;

var json = require("../../../lib/json"),
	o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


// !"has_one:foreign_key"
describe("has_one:foreign_key", function () {

	var data, relation;


	beforeEach(function () {
		// create new data object
		data = {
			"person": {
				"alfred": {
					"id": "alfred",
					"face": "large"
				}
			},
			"nose": {
				"large": {"id": "large"},
				"big": {"id": "big"}
			}
		};
		// and setup relationship
		relation = new Relation(data, "person has_one:nose on:face");
	});

	it("should return type has_one:foreign_key", function () {
		expect(relation.id).to.eq("has_one:foreign_key");
	});

	// load

	it("should add linked tupel to parent tupel", function () {
		relation.load("alfred");

		expect(data.person.alfred.face.id).to.eq("large");
	});

	it("should replace loaded tupel", function () {
		relation.load("alfred");
		data.person.alfred.face = "big";
		relation.load("alfred");

		expect(data.person.alfred.face.id).to.eq("big");
	});

	// update

	it("should add new tupel to relatedModel", function () {
		var id;
		data.person.alfred.face = {"id": "broad"};
		relation.update("alfred");
		id = o.keyOf(data.nose, data.person.alfred.face);

		expect(id).to.not.be.null;
		expect(data.nose[id].id).to.eq("broad");
	});

	// unload

	it("should reverse load", function () {
		var orig = json.copy(data);
		relation.load("alfred");
		relation.unload("alfred");

		expect(orig.person.alfred).to.deep.eq(data.person.alfred);
	});
});