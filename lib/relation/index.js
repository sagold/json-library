/**
 * Json relationship
 * @version  0.0.1
 */
"use strict";

// loads a module and its relationship
exports.load = require("./load");
// reverts relationship to original model
exports.unload = require("./unload");
// validates relationship definition
exports.validate = require("./validate");

// add model
// add(model, property, value, defRelation)

// remove model
// remove(model, property, defRelation)

// sanitize relationship
// sanitize(model, defRelation)

// @refactor load/unload-controller resolving type of relationship (or switch)
// @extend check for array in defRelation
// @extend create model-baseClass (sortof)
// @think json schema and resolved models?
