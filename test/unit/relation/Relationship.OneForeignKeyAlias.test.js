"use strict";

var expect = require("chai").expect,
	sinon = require("sinon");

var json = require("../../../lib/json"),
	o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("has_one:foreign_key:alias", function () {

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
		// create relationship
		relation = relation = new Relation(data, "person has_one:nose on:face as:nose");
	});

	it("should return type has_one:foreign_key:alias", function () {
		expect(relation.id).to.eq("has_one:foreign_key:alias");
	});

	// load

	it("should add linked tupel in foreign key to parent tupel", function () {
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
		data.person.alfred.face = "big";
		relation.load("alfred");

		expect(data.person.alfred.nose.id).to.eq("big");
	});

	// update

	it("should add new tupel to related model", function () {
		var id;
		data.person.alfred.nose = {"id": "broad"};
		relation.update("alfred");
		id = o.keyOf(data.nose, data.person.alfred.nose);

		expect(id).to.not.be.null;
		expect(data.nose[id].id).to.eq("broad");
	});

	it("should update foreign key", function () {
		var id;
		data.person.alfred.nose = {"id": "broad"};
		relation.update("alfred");
		id = o.keyOf(data.nose, data.person.alfred.nose);

		expect(id).to.not.be.null;
		expect(data.person.alfred.face).to.eq(id);
	});

	// unload

	it("should reverse load", function () {
		var orig = json.copy(data);
		relation.load("alfred");
		relation.unload("alfred");

		expect(orig.person.alfred).to.deep.eq(data.person.alfred);
	});

	it("should update foreign key on unload", function () {
		data.person.alfred.nose = data.nose.big;
		relation.unload("alfred");

		expect(data.person.alfred.face).to.eq("big");
	});

	// link

	it("should add tupel on the given model", function () {
		var tupel = {id: "new tupel"};
		relation.link("alfred", tupel);

		expect(data.person.alfred.nose).to.eq(tupel);
	});

	it("should create model if it does not exist", function () {
		var tupel = {id: "new tupel"};
		relation.link("alfons", tupel);

		expect(data.person.alfons.nose).to.eq(tupel);
	});

	it("should call update on link", function () {
		var update = sinon.spy(relation, "update");
		relation.link("alfred", true);

		expect(update.called).to.be.true;
	});

	// unlink

	it("should remove related tupel", function () {
		relation.unlink("alfred");

		expect(data.person.alfred.nose).to.be.undefined;
	});

	it("should call update on unlink", function () {
		var update = sinon.spy(relation, "update");
		relation.unlink("alfred");

		expect(update.called).to.be.true;
	});

	it("should unlink only given tupel if passed", function () {
		relation.loadAll();
		relation.unlink("alfred", data.nose.big);

		expect(data.person.alfred.nose).to.eq(data.nose.large);
	});
});
