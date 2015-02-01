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
			var relationship = "articles has_one:contents as:article through:articles_contents";
			relationship = {
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
			var relationship = "articles hasOne:contents as:article through:articles_contents";
			relationship = {
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
			var relationship = "articles hasOne:contents in:article";
			relationship = {
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
});
