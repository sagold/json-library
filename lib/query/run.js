"use strict";


var filter = require("./filter");
var parsePointer = require("./common").parsePointer;
var join = require("../pointer/join");


/**
 * callback for each match of json-glob-pointer
 *
 * @param  {[type]}   obj         [description]
 * @param  {[type]}   jsonPointer function (value, key, parentObject, pointerToValue)
 * @param  {Function} cb          [description]
 * @return {[type]}               [description]
 */
function queryRun(obj, jsonPointer, cb) {
    // get steps into obj
    var steps = parsePointer(jsonPointer);

    // cleanup first and last
    if (steps[0] === "") steps.shift();
    if (steps[steps.length - 1] === "") steps.length -= 1;
    if (steps.length <= 0) {
        return cb(obj, "#", obj, "#");
    }

    return _query(obj, steps, cb, "#");
}

function cbPassAll(obj, cb, pointer) {
    return function (key) {
        cb(obj[key], key, obj, join(pointer, key));
    };
}

function _query(obj, steps, cb, pointer) {
    var matches;
    var query = steps.shift();

    if (steps.length === 0) {
        // get keys matching the query and call back
        matches = filter.keys(obj, query);
        matches.forEach(cbPassAll(obj, cb, pointer));

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


module.exports = queryRun;
