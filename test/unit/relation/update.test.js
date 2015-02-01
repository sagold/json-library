var expect = require("chai").expect;

var update = require("../../../lib/relation/update");


describe("relation.update", function () {

	var data;

	beforeEach(function () {
		data = {

			"articles": {
				"latest": {
					"title": "Each article has one content"
				}
			},

			"contents": {
				"latest_content": {
					"body": "latest content"
				}
			},

			"articles_contents": {}
		};
	});

	describe("has_one", function () {

		it("should update relationships in pivot", function () {
			// "articles has_one:contents as:article through:articles_contents";
			var relationship = {
				model: "#/articles",
				type: "has_one",
				references: "#/contents",
				alias: "article",
				through: "articles_contents"
			};
			// link latest content to article
			data.articles.latest.article = data.contents.latest_content;

			update(data, relationship);

			expect(data["articles_contents"].latest).to.eql("latest_content");
		});

		it("should update reference model and pivot table", function () {
			// "articles hasOne:contents as:article through:articles_contents";
			var relationship = {
				model: "#/articles",
				type: "has_one",
				references: "#/contents",
				through: "articles_contents",
				alias: "article"
			};
			// link latest content to article
			data.articles.latest.article = data.contents.latest_content;
			delete data.contents.latest_content;

			update(data, relationship);

			expect(data["articles_contents"].latest).to.eql("latest");
			expect(data["contents"].latest).to.deep.eql(data["articles"].latest["article"]);
		});

		it("should update reference model", function () {
			// "articles hasOne:contents as:article";
			var relationship = {
				model: "#/articles",
				type: "has_one",
				references: "#/contents",
				foreign_key: "article"
			};
			// link latest content to article
			data.articles.latest.article = data.contents.latest_content;
			delete data.contents.latest_content;

			update(data, relationship);

			expect(data["contents"].latest).to.deep.eql(data["articles"].latest["article"]);
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
			// "articles has_many:contents as:articles through:articles_contents";
			var relationship = {
				model: "#/articles",
				type: "has_many",
				references: "#/contents",
				alias: "articles",
				through: "articles_contents"
			};
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];

			update(data, relationship);

			expect(data["articles_contents"]["latest"].length).to.eql(2);
			expect(data["articles_contents"]["latest"].indexOf("latest_content")).to.not.eql(-1);
			expect(data["articles_contents"]["latest"].indexOf("content")).to.not.eql(-1);
		});

		it("should update relationships in referenced model", function () {
			// "articles has_many:contents as:articles through:articles_contents";
			var relationship = {
				model: "#/articles",
				type: "has_many",
				references: "#/contents",
				alias: "articles",
				through: "articles_contents"
			};
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];
			delete data.contents.latest_content;
			delete data.contents.content;

			update(data, relationship);

			expect(data.contents["latest"]).to.eql(data.articles.latest.articles[0]);
			expect(data.contents["latest-0"]).to.eql(data.articles.latest.articles[1]);
		});

		it("should update foreign_keys", function () {
			// "articles has_many:contents as:articles through:articles_contents";
			var relationship = {
				model: "#/articles",
				type: "has_many",
				references: "#/contents",
				foreign_key: "articles_pk",
				alias: "articles"
			};
			// link latest content to article
			data.articles.latest.articles = [ data.contents.latest_content, data.contents.content ];

			update(data, relationship);

			expect(data.articles.latest.articles_pk.length).to.eql(2);
			expect(data.articles.latest.articles_pk.indexOf("latest_content")).to.not.eql(-1);
			expect(data.articles.latest.articles_pk.indexOf("content")).to.not.eql(-1);
		});
	});
});
