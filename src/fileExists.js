const fs = require('fs');
const path = require('path');

/**
 * Helper function that checks if a file exists in the current working directory.
 *
 * @param {String} filename The file to check
 * @return {Boolean} true if the file exists, false otherwise
 */
module.exports = function fileExists(filename) {
	try {
		return fs.lstatSync(path.join(process.cwd(), filename));
	} catch (e) {
		return false;
	}
}
