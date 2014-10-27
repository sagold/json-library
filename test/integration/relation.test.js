var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs");

var relation = require("../../lib/relation");

describe("relation", function () {

	var modifiedData,
		originalData;

	beforeEach(function () {
		modifiedData = fs.readFileSync(path.join(__dirname, "../support/simple.json"));
		originalData = JSON.parse(modifiedData);
		modifiedData = JSON.parse(modifiedData);
	});

	it ("should unload has_one:foreign_key to original object", function () {
		var model, shirt_size = {
			"model": "#/shirt",
			"foreign_key": "related_size",
			"references": "#/size"
		};
		model = relation.load(modifiedData, shirt_size);
		// relationship should have been loaded
		expect(model.hotpink.related_size.name).to.eq("small");
		// log
		fs.writeFileSync(path.join(__dirname, "../log/simple.has_one.loaded.json"), JSON.stringify(modifiedData, null, 4));

		model = relation.unload(modifiedData, shirt_size);

		expect(model.hotpink.related_size).to.eq("small");
		expect(originalData).to.deep.eql(modifiedData);
		// log
		fs.writeFileSync(path.join(__dirname, "../log/simple.has_one.unloaded.json"), JSON.stringify(modifiedData, null, 4));
	});

	it ("should unload has_many:through:alias to original object", function () {
		var model, shirt_sizes = {
			"model": "#/shirt",
			"through": "shirt_sizes",
			"alias": "sizes",
			"references": "#/size",
			"type": "has_many"
		};
		model = relation.load(modifiedData, shirt_sizes);
		// relationship should have been loaded
		expect(model.white.sizes.length).to.eq(2);
		expect(model.white.sizes[1].name).to.eq("small");
		// log
		fs.writeFileSync(path.join(__dirname, "../log/simple.has_many.loaded.json"), JSON.stringify(modifiedData, null, 4));

		model = relation.unload(modifiedData, shirt_sizes);

		expect(model.white.sizes).to.be.undefined;
		expect(originalData).to.deep.eql(modifiedData);
		// log
		fs.writeFileSync(path.join(__dirname, "../log/simple.has_many.unloaded.json"), JSON.stringify(modifiedData, null, 4));
	});

});
