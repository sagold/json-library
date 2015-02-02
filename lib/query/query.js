"use strict";

var o = require("../object"),
    filter = require("./filter"),
    pointerCommon = require("../pointer/common");


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
