var relationTypes = ["has_one", "has_many"];

/*
	Consider a more simple relationship definition, i.e.

		- readable definition by string, i.e.
			- parentObject has_one childObject alias children through pivotTable
			- parentObject has_one childObject on relatedKey
			- parentObject has_one:childObject on:relatedKey...
 */

// "articles has_one:contents as:article through:articles_contents";
// "articles has_one:contents as:article on:foreign_key";
// "articles has_many:contents as:articles through:articles_contents";
// "articles has_many:contents as:articles through:articles_contents";
// "articles has_many:contents as:articles through:articles_contents";

function createDefinitionObject(relationship) {
	var properties;

	if (typeof relationship === "string") {

		properties = relationship.split(" ");
		relationship = {};

		properties.forEach(function (item) {
			var properties;

			if (item.indexOf(":") === -1) {
				relationship.model = item;

			} else {
				properties = item.split(":");
				if (relationTypes.indexOf(properties[0]) > -1) {
					relationship["type"] = properties[0];
					relationship["references"] = properties[1];

				} else {
					relationship[properties[0]] = properties[1];
				}
			}
		});

		if (relationship.on == null && relationship.as == null) {
			throw new Error('"as:<alias>" or "on:<foreign_key>" missing in relationship definition');
		}
		if (relationship.model == null) {
			throw new Error('no model defined in relationship definition');
		}
		if (relationship.type == null) {
			throw new Error('no related model defined in relationship definition');
		}

		relationship.alias = relationship.as;
		delete relationship.as;

		relationship.foreign_key = relationship.on;
		delete relationship.on;
	}

	return relationship;
}

module.exports = createDefinitionObject;
