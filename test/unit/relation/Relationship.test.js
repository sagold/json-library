"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("RelationFactory", function () {

	var data, relation;


	// !all
	describe("all", function () {

		beforeEach(function () {
			data = {
				"person": {
					"hans": { "fpk": "square" },
					"alfred": { "fpk": "large" }
				},
				"nose": {
					"square": { "id": "square" },
					"large": { "id": "large" }
				}
			};
			// create relationship
			relation = new Relation(data, "person has_one:nose as:nose on:fpk");
		});

		it("should load all tupels", function () {
			relation.loadAll();

			expect(data.person.hans.nose.id).to.eq("square");
			expect(data.person.alfred.nose.id).to.eq("large");
		});

		it("should unload all tupels", function () {
			var orig = o.copy(data);
			relation.loadAll();
			relation.unloadAll();

			expect(orig).to.deep.eq(data);
		});

		it("should update all tupels", function () {
			data.person.hans.nose = data.nose.large;
			data.person.alfred.nose = data.nose.square;
			relation.updateAll();

			expect(data.person.hans.fpk).to.eq("large");
			expect(data.person.alfred.fpk).to.eq("square");
		});
	});


	// !has one
	describe("has_one", function () {

		beforeEach(function () {
			// create new data object
			data = {
				"person": [
					{
						"id": "alfred",
						"face": 0
					}
				],
				"nose": [
					{"id": "large"},
					{"id": "big"}
				]
			};
			// create relationship
			relation = relation = new Relation(data, "person has_one:nose on:face as:nose");
		});

		it("should load array models", function () {
			relation.load(0);

			expect(data.person[0].nose.id).to.eq("large");
		});

		it("should unload array models", function () {
			relation.load(0);
			relation.unload(0);

			expect(data.person[0].face).to.eq(0);
		});

		it("should update array models", function () {
			data.person[0].nose = {"id": "square"};
			relation.update(0);

			expect(data.nose[2].id).to.eq("square");
			expect(data.person[0].face).to.eq(2);
		});
	});


	// !has many
	describe("has_many", function () {

		beforeEach(function () {
			data = {
				"person": [
					{"id": "alfred"}
				],
				"ears": [
					{"id": "big"},
					{"id": "large"},
					{"id": "square"}
				],
				"person_ears": {
					"0": [1, 0]
				}
			};
			// create relationship
			relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
		});

		it("should load array models", function () {
			relation.load(0);

			expect(data.person[0].ears.length).to.eq(2);
			expect(data.person[0].ears[1].id).to.eq("big");
		});

		it("should unload array models", function () {
			relation.load(0);
			relation.unload(0);

			expect(data.person[0].ears).to.undefined;
			expect(data.person_ears[0].length).to.eq(2);
		});

		it("should update array models", function () {
			data.person[0].ears = [{"id": "dumbo"}];
			relation.update(0);

			expect(data.ears[3].id).to.eq("dumbo");
			expect(data.person_ears[0][0]).to.eq(3);
			expect(data.person_ears[0].length).to.eq(1);
		});
	});
});
