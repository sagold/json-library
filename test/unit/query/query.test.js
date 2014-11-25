var expect = require("chai").expect;

var q = require("../../../lib/query");

describe("query", function () {

	var cbMock;

	beforeEach(function () {

		cbMock = function cbMock(value) {
			cbMock.args.push(arguments);
			cbMock.called = true;
		}

		cbMock.called = false;
		cbMock.args = [];
	});

	it("should callback for matched jsonpointer", function () {

		q.query({
			"first": {
				"value": "text"
			}
		}, "/first", cbMock);

		expect(cbMock.called).to.be.true;
		expect(cbMock.args.length).to.eq(1);
		expect(cbMock.args[0][0].value).to.eq("text");
	});

	it("should callback with value, object, key", function () {

		q.query({
			"first": {
				"value": "text"
			}
		}, "/first", cbMock);

		expect(cbMock.args[0][0].value).to.eq("text");
		expect(cbMock.args[0][1].first.value).to.eq("text");
		expect(cbMock.args[0][2]).to.eq("first");
	});

	it("should callback on nested objects", function () {

		q.query({
			"first": {
				"value": "text"
			}
		}, "/first/value", cbMock);

		expect(cbMock.args.length).to.eq(1);
		expect(cbMock.args[0][0]).to.eq("text");
	});

	it("should callback only if match", function () {

		q.query({
			"first": {
				"value": "text"
			}
		}, "/first/second", cbMock);

		expect(cbMock.called).to.be.false;
		expect(cbMock.args.length).to.eq(0);
	});

	it("should callback on all items", function () {

		q.query({
			"first": {
				"value": "text"
			},
			"second": "last"
		}, "/*", cbMock);

		expect(cbMock.called).to.be.true;
		expect(cbMock.args.length).to.eq(2);
		expect(cbMock.args.pop()[0]).to.eq("last");
	});

	it("should continue for all found items", function () {

		q.query({
			"first": {
				"value": "first"
			},
			"second": {
				"value": "second"
			},
			"third": {
				"value": "third"
			}

		}, "/*/value", cbMock);

		expect(cbMock.called).to.be.true;
		expect(cbMock.args.length).to.eq(3);
		expect(cbMock.args.pop()[0]).to.eq("third");
	});

	it("should callback on matched items", function () {

		q.query({
			"first": {
				"value": "text"
			},
			"second": {
				"value": "last"
			}
		}, "/*|value:last", cbMock);

		expect(cbMock.called).to.be.true;
		expect(cbMock.args.length).to.eq(1);
		expect(cbMock.args.pop()[0].value).to.eq("last");
	});

	it("should continue after query", function () {

		q.query({
			"first": {
				"value": "text"
			},
			"second": {
				"value": "last"
			}
		}, "/*|value:last/value", cbMock);

		expect(cbMock.called).to.be.true;
		expect(cbMock.args.length).to.eq(1);
		expect(cbMock.args.pop()[0]).to.eq("last");
	});
});
