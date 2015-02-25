"use strict";

/**
 * Copies data as json data
 *
 * @param  {Mixed} data	values to copy, removes non json data like functions, nodes, ...
 * @return {Mixed} copy
 */
function copy(data) {
	return JSON.parse(JSON.stringify(data));
}

module.exports = copy;
