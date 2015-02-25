/**
 * Returns all values of the given input data
 * @param  {Mixed} value input data
 * @return {Array} array of input data's values
 */
function values(value) {
	var values;

	if (Array.isArray(value)) {
		// []
		values = value;
	} else if (Object.prototype.toString.call(value) === "[object Object]") {
		// {}
		values = Object.keys(value).map(function (key) {
			return value[key];
		});
	} else if (value != null) {
		// *
		values = [value];
	} else {
		values = [];
	}

	return values;
}

module.exports = values;
