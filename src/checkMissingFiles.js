const fileExists = require('./fileExists');
const chalk = require('chalk');

/**
 * Helper to output whether a message for whether or not a file was missing.
 *
 * {String|String[]} filenames The filenames to check existence of
 * {String} [missingMessage] The message that is appended to the
 *    filenames in the output log message when a file is missing.
 * return {Boolean} true if the file was there, false otherwise
 */
function checkFile(filenames, missingMessage) {
	if (!Array.isArray(filenames)) {
		filenames = [filenames];
	}
	const indent = '  ';

	for (const filename of filenames) {
			if (fileExists(filename)) {
				console.log(chalk.green(`${indent}✔ ${filename}`))
				return true;
			}
	}

	console.log(chalk.red(`${indent}✖ ${filenames.join(' or ')}${missingMessage ?
		`. ${missingMessage}` : ''}`))
	return false;
}

/**
 * Checks for existence of thumbnail.png and preview.png|jpg and outputs a
 * warning message if they are not found. See http://bl.ocks.org/-/about.
 *
 * @return {Boolean} true if files are missing false if all files are present
 */
module.exports = function checkMissingFiles() {
	const filesToCheck = [
		{ filenames: 'thumbnail.png', missingMessage: 'Expected a 230x120 image.' },
		{ filenames: ['preview.png', 'preview.jpg'], missingMessage: 'Expected a 960x500 image.' },
		{ filenames: 'README.md' },
	];

	console.log(chalk.dim('Checking for expected files:\n'));
	const isMissingFiles = filesToCheck.reduce((anyMissing, file) =>
		anyMissing | !checkFile(file.filenames, file.missingMessage),
		false);

	console.log();

	return isMissingFiles;
}
