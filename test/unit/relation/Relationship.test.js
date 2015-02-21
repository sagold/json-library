"use strict";

var expect = require("chai").expect;

var o = require("../../../lib/object"),
	Relation = require("../../../lib/relation/Relationship");


describe("RelationFactory", function () {

	var data, relation;


	describe("has_one:foreign_key", function () {

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
			var orig = o.copy(data);
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig.person.alfred).to.deep.eq(data.person.alfred);
		});
	});


	describe("has_one:foreign_key:alias", function () {

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
			var orig = o.copy(data);
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig.person.alfred).to.deep.eq(data.person.alfred);
		});

		it("should update foreign key on unload", function () {
			data.person.alfred.nose = data.nose.big;
			relation.unload("alfred");

			expect(data.person.alfred.face).to.eq("big");
		});
	});


	describe("has_one:through:alias", function () {

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
					},
					"square": {
						"id": "square"
					}
				},
				"person_ears": {
					"alfred": ["large", "big"]
				}
			};
			// create relationship
			relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
		});

		it("should return type has_many:through:alias", function () {
			expect(relation.id).to.eq("has_many:through:alias");
		});

		// load

		it("should link all tupels speicified in pivot on alias", function () {
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

		it("should replace new tupel", function () {
			relation.load("alfred");
			data.person_ears.alfred = ["square"];
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(1);
			expect(data.person.alfred.ears[0].id).to.eq("square");
		});

		// update

		it("should add new tupel to related model", function () {
			var id, tupel = {"id": "round"};
			data.person.alfred.ears = [tupel];
			relation.update("alfred");
			id = o.keyOf(data.ears, tupel);

			expect(id).to.not.be.null;
			expect(data.ears[id].id).to.eq("round");
		});

		it("should update pivot", function () {
			var id, tupel = {"id": "round"};
			data.person.alfred.ears = [tupel];
			relation.update("alfred");
			id = o.keyOf(data.ears, tupel);

			expect(id).to.not.be.null;
			expect(data.person_ears.alfred.length).to.eq(1);
			expect(data.person_ears.alfred[0]).to.eq(id);
		});

		// unload

		it("should reverse load", function () {
			var orig = o.copy(data);
			relation.load("alfred");
			relation.unload("alfred");

			expect(orig).to.deep.eq(data);
		});

		it("should update pivot table on unload", function () {
			data.person.alfred.ears = [data.ears.big];
			relation.unload("alfred");

			expect(data.person_ears.alfred.length).to.eq(1);
			expect(data.person_ears.alfred[0]).to.eq("big");
		});
	});


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
});