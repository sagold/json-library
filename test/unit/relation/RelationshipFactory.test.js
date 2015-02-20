"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/RelationshipFactory");


describe("RelationFactory", function () {

	var data;

	describe("has_one:foreign_key", function () {

		beforeEach(function () {
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
		});

		it("should return type has_one:foreign_key", function () {
			var relation = new Relation(data, "person has_one:nose on:face");

			expect(relation.id).to.eq("has_one:foreign_key");
		});

		// load

		it("should add linked tupel to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose on:face");
			relation.load("alfred");

			expect(data.person.alfred.face.id).to.eq("large");
		});

		it("should not replace loaded tupel", function () {
			var relation = new Relation(data, "person has_one:nose on:face");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.face.id).to.eq("large");
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
			var relation = new Relation(data, "person has_one:nose on:face");
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig.person.alfred).to.deep.eq(data.person.alfred);
		});

		// update

		// add
		// remove
		// insert
		// delete

	});


	describe("has_one:foreign_key:alias", function () {

		beforeEach(function () {
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
		});

		it("should return type has_one:foreign_key:alias", function () {
			var relation = new Relation(data, "person has_one:nose on:face as:nose");

			expect(relation.id).to.eq("has_one:foreign_key:alias");
		});

		// load

		it("should add linked tupel in foreign key to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose on:face as:nose");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
		});

		it("should keep linked tupel intact", function () {
			var relation = new Relation(data, "person has_one:nose on:face as:nose");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
			var relation = new Relation(data, "person has_one:nose on:face as:nose");
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig.person.alfred).to.deep.eq(data.person.alfred);
		});

		it("should update foreign key on unload", function () {
			var relation = new Relation(data, "person has_one:nose on:face as:nose");
			data.person.alfred.nose = data.nose.big;
			relation.unload("alfred");

			expect(data.person.alfred.face).to.eq("big");
		});

		// update

		// add
		// remove
		// insert
		// delete
	});


	describe("has_one:through:alias", function () {

		beforeEach(function () {
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
		});

		it("should return type has_one:through:alias", function () {
			var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");

			expect(relation.id).to.eq("has_one:through:alias");
		});

		// load

		it("should add linked tupel in pivot to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
		});

		it("should keep linked tupel intact", function () {
			var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
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

		// update

		// add
		// remove
		// insert
		// delete
	});


	describe("has_many:foreign_key", function () {

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
		});

		it("should return type has_many:foreign_key", function () {
			var relation = new Relation(data, "person has_many:ears on:ears");

			expect(relation.id).to.eq("has_many:foreign_key");
		});

		// load

		it("should replace all keys at foreign_key by related tupels", function () {
			var relation = new Relation(data, "person has_many:ears on:ears");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
		});

		it("should keep linked tupels intact", function () {
			var relation = new Relation(data, "person has_many:ears on:ears");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
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

		// update

		// add
		// remove
		// insert
		// delete
	});


	describe("has_many:foreign_key:alias", function () {

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
		});

		it("should return type has_many:foreign_key:alias", function () {
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");

			expect(relation.id).to.eq("has_many:foreign_key:alias");
		});

		// load

		it("should link all tupels specified in foreign_key on alias", function () {
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");
			relation.load("alfred");

			expect(data.person.alfred.feet.length).to.eq(2);
			expect(data.person.alfred.feet[1].id).to.eq("big");
		});

		it("should keep linked tupels intact", function () {
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.feet.length).to.eq(2);
			expect(data.person.alfred.feet[1].id).to.eq("big");
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig).to.deep.eq(data);
		});

		it("should update foreign keys on unload", function () {
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");
			data.person.alfred.feet = [data.ears.broad, data.ears.big];
			relation.unload("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[0]).to.eq("broad");
			expect(data.person.alfred.ears[1]).to.eq("big");
		});

		// update

		// add
		// remove
		// insert
		// delete
	});


	describe("has_many:foreign_key:alias", function () {

		beforeEach(function () {
			data = {
				"person": {
					"alfred": {
						"id": "alfred"
					}
				},
				"ears": {
					"big": {
						"id": "big"
					},
					"large": {
						"id": "large"
					}
				},
				"person_ears": {
					"alfred": ["large", "big"]
				}
			};
		});

		it("should return type has_many:through:alias", function () {
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");

			expect(relation.id).to.eq("has_many:through:alias");
		});

		// load

		it("should link all tupels speicified in pivot on alias", function () {
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
		});

		it("should keep linked tupels intact", function () {
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
			relation.load("alfred");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig).to.deep.eq(data);
		});

		it("should update pivot table on unload", function () {
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
			data.person.alfred.ears = [data.ears.big];
			relation.unload("alfred");

			expect(data.person_ears.alfred.length).to.eq(1);
			expect(data.person_ears.alfred[0]).to.eq("big");
		});

		// update

		// add
		// remove
		// insert
		// delete
	});
});