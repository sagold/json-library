var expect = require("chai").expect;

var update = require("../../../lib/relation/updatePivots");


describe("relation.update", function () {

	var data;

	beforeEach(function () {
		data = {
			"articles": {
				"first": {
					"id": "first",
					// foreign: <key>
					// article: {}
				}
			},

			"contents": {
				"current": {
					"id": "current"
				}
			},

			"articles_contents": {}
		};
	});

	describe("has_one", function () {

		describe("foreign key", function () {

			it("should add linked object to related model", function () {
				// link latest content to article
				data.articles["first"].article = { "id": "new"};
				update(data, "articles has_one:contents on:article");

				expect(data.contents.first).to.eql(data.articles.first.article);
			});

			it("should replace linked model pk in foreign key", function () {
				// link latest content to article
				data.articles["first"].article = { "id": "new"};
				data.articles["first"].foreign = "current";
				update(data, "articles has_one:contents as:article on:foreign");

				expect(data.articles.first.foreign).to.eql("first");
			});
		});

		describe("pivot table", function () {

			it("should replace relationships in pivot", function () {
				// link latest content to article
				data.articles.first.article = { "id": "new"};
				data.articles_contents.first = "to be replaced";
				update(data, "articles has_one:contents as:article through:articles_contents");

				expect(data.articles_contents.first).to.eql("first");
			});

			it("should add linked object to reference model", function () {
				// link latest content to article
				data.articles.first.article = { "id": "new"};
				update(data, "articles has_one:contents as:article through:articles_contents");

				expect(data.contents.first).to.eql(data.articles.first.article);
			});
		});
	});

	describe("has_many", function () {

		beforeEach(function () {
			data = {
				"articles": {
					"latest": {
						"title": "Each article has one content"
						// articles: [ {}, {} ]
					}
				},

				"contents": {
					"latest_content": {
						"body": "latest content"
					},
					"content": {
						"body": "another content"
					}
				},

				"articles_contents": {}
			};
		});

		it("should update relationships in pivot", function () {
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];
			update(data, "articles has_many:contents as:articles through:articles_contents");

			expect(data.articles_contents.latest.length).to.eql(2);
			expect(data.articles_contents.latest.indexOf("latest_content")).to.not.eql(-1);
			expect(data.articles_contents.latest.indexOf("content")).to.not.eql(-1);
		});

		it("should update relationships in referenced model", function () {
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];
			delete data.contents.latest_content;
			delete data.contents.content;
			update(data, "articles has_many:contents as:articles through:articles_contents");

			expect(data.contents["latest"]).to.eql(data.articles.latest.articles[0]);
			expect(data.contents["latest-0"]).to.eql(data.articles.latest.articles[1]);
		});

		it("should update foreign_keys", function () {
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];
			update(data, "articles has_many:contents as:articles on:articles_pk");

			expect(data.articles.latest.articles_pk.length).to.eql(2);
			expect(data.articles.latest.articles_pk.indexOf("latest_content")).to.not.eql(-1);
			expect(data.articles.latest.articles_pk.indexOf("content")).to.not.eql(-1);
		});
	});
});
