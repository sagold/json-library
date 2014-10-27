/**
 * json pointer implementation
 */

function stripPointerPrefix(pointer) {
	return pointer.replace(/[#/]*/, "");
}

function get(pointer, data) {
	if (pointer == null || data == null) {
		return null;
	}

	var path = stripPointerPrefix(pointer).split("/");
	return _get(path, data);
}

function _get(path, data) {
	var property = path.shift();
	if (property) {
		if (data[property]) {
			return _get(path, data[property]);
		} else {
			return null;
		}
	} else {
		return data;
	}
}


module.exports.get = get;