"use strict";

var o = require("../object"),
    filter = require("./filter"),
    pointerCommon = require("../pointer/common"),
    join = require("../pointer/join");


/**
 * callback for each match of json-glob-pointer
 *
 * @param  {[type]}   obj         [description]
 * @param  {[type]}   jsonpointer function (value, key, parentObject, pointerToValue)
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
function query(obj, jsonpointer, cb) {
    // get steps into obj
    var steps = pointerCommon.stripPointerPrefix(jsonpointer).split("/");
    // cleanup first and last
    if (steps[0] == "") steps.shift();
    if (steps[steps.length - 1] == "") steps.length -= 1;

    _query(obj, steps, cb, "#");
}

function queryCallback(obj, cb, pointer) {
    return function (key) {
        cb(obj[key], obj, key, join(pointer, key));
    }
}

function _query(obj, steps, cb, pointer) {
    var matches, query = steps.shift();

    if (steps.length === 0) {
        // get keys matching the query and call back
        matches = filter.keys(obj, query);
        matches.forEach(queryCallback(obj, cb, pointer));

    } else if (/^\*\*/.test(query)) {
        // run next query on current object
        _query(obj, steps.slice(0), cb, pointer);

    } else {
        matches = filter.keys(obj, query);
        matches.forEach(function (key) {
            _query(obj[key], steps.slice(0), cb, join(pointer, key));
        });
    }

    if (/^\*\*/.test(query)) {
        // match this query (**) again
        steps.unshift(query);
        matches = filter.keys(obj, query);
        matches.forEach(function (key) {
            _query(obj[key], steps.slice(0), cb, join(pointer, key));
        });
    }
}

module.exports = query;
