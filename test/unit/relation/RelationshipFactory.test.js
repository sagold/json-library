"use strict";

var expect = require("chai").expect;

var Relation = require("../../../lib/relation/RelationshipFactory");


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

		it("should return instance of RelationFactory", function () {
			var relation = new Relation(data, "person has_one:nose on:face");

			expect(relation.constructor).to.eq(Relation);
		});

		it("should add linked tupel to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose on:face");
			relation.load("alfred");

			expect(data.person.alfred.face.id).to.eq("large");
		});
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

		it("should add linked tupel in foreign key to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose on:face as:nose");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
		});
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

		it("should add linked tupel in pivot to parent tupel", function () {
			var relation = new Relation(data, "person has_one:nose through:person_nose as:nose");
			relation.load("alfred");

			expect(data.person.alfred.nose.id).to.eq("large");
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
					}
				}
			};
		});

		it("should return instance of RelationFactory", function () {
			var relation = new Relation(data, "person has_many:ears on:ears");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
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
					}
				}
			};
		});

		it("should return instance of RelationFactory", function () {
			var relation = new Relation(data, "person has_many:ears as:feet on:ears");
			relation.load("alfred");

			expect(data.person.alfred.feet.length).to.eq(2);
			expect(data.person.alfred.feet[1].id).to.eq("big");
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
					}
				},
				"person_ears": {
					"alfred": ["large", "big"]
				}
			};
		});

		it("should return instance of RelationFactory", function () {
			var relation = new Relation(data, "person has_many:ears as:ears through:person_ears");
			relation.load("alfred");

			expect(data.person.alfred.ears.length).to.eq(2);
			expect(data.person.alfred.ears[1].id).to.eq("big");
		});
	});
});