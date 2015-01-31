/**
 *
 * JSONPOINTER|*
 *
 * 	asfe/asd/*		=> ITERATIVELY SELECT 1 property or all
 *
 * body/*|type:VariableDeclarator/declarations/*
 *
 *
 * /*|type:true/	=> for all properties | get values which have property: type == true
 *
 *
 *
 * JSONBUILDER
 *
 * /asdje/12/[]/[asd]	add object, add in object, add array, add in array
 *
 * "parent":		returns value of parent or created object
 * "parent[]":		returns object inserted to array
 * "parent[x]":		returns index x or created object
 * "parent.child":	returns object child in parent
 *
 * "parent/1/child"
 * "parent/[]/[]/json
 */
var o = require("../object"),
    filter = require("./filter"),
    pointerCommon = require("../pointer/common");


function query(obj, jsonpointer, cb) {
    // get steps into obj
    var steps = pointerCommon.stripPointerPrefix(jsonpointer).split("/");
    // cleanup first and last
    if (steps[0] == "") steps.shift();
    if (steps[steps.length - 1] == "") steps.length -= 1;

    _query(obj, steps, cb);
}

function queryCallback(obj, cb) {
    return function (key) {
        cb(obj[key], obj, key);
    }
}

function _query(obj, steps, cb) {
    var matches, query = steps.shift();

    if (steps.length === 0) {
        // get keys matching the query and call back
        matches = filter.keys(obj, query);
        matches.forEach(queryCallback(obj, cb));

    } else if (/^\*\*/.test(query)) {
        // run next query on current object
        _query(obj, steps.slice(0), cb);

    } else {
        matches = filter.values(obj, query);
        matches.forEach(function (value) {
            _query(value, steps.slice(0), cb)
        });
    }

    if (/^\*\*/.test(query)) {
        // match this query (**) again
        steps.unshift(query);
        matches = filter.values(obj, query);
        matches.forEach(function (value) {
            _query(value, steps.slice(0), cb)
        });
    }
}

module.exports = query;
