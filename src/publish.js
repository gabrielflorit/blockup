const chalk = require('chalk');
const inquirer = require('inquirer');
const child = require('child_process');
const path = require('path');

const checkMissingFiles = require('./checkMissingFiles');
const fileExists = require('./fileExists');

/**
 * Publishes a new gist via gistup. First verifies that all
 * expected files exist. If the current directory is already a
 * git repo, it informs the user to use git to update the block.
 * If it is not a git repo, the user can enter a title for the block
 * then gistup is used to publish it.
 */
module.exports = function publish() {
	Promise.resolve()
		.then(() => new Promise(interactiveCheckMissingFiles))
		.then(() => new Promise(checkForGitRepo))
		.then(() => new Promise(promptForBlockTitle))
		.then(title => new Promise((resolve, reject) => gistup(title, resolve, reject)))
		.catch((err) => {
			if (err) {
				console.log();
				console.log(chalk.red(err));
			}
			console.log(chalk.dim('\nPublish was aborted.\n'));
		});
}

/**
 * Checks for missing files and gives user the option to abort if
 * files are missing.
 */
function interactiveCheckMissingFiles(resolve, reject) {
	const isMissingFiles = checkMissingFiles();
	console.log();

	if (isMissingFiles) {
		const questions = [{
			type: 'confirm',
			name: 'publish',
			message: 'Some expected files are missing. Proceed with publishing?',
			default: false
		}];
		inquirer.prompt(questions).then(function (answers) {
			if (answers.publish) {
				console.log();
				resolve();
			} else {
				reject();
			}
		});
	} else {
		resolve();
	}
}

function checkForGitRepo(resolve, reject) {
	// check if we are in a git repo
	if (fileExists('.git')) {
		console.log(chalk.yellow('This is already a git repo. Update your block with standard git commands.'));
		reject();
	} else {
		resolve();
	}
}

function promptForBlockTitle(resolve, reject) {
	const questions = [{
		type: 'input',
		name: 'title',
		message: 'Block Title:',
	}];
	inquirer.prompt(questions).then(function (answers) {
		const title = answers.title.trim();
		resolve(title.length ? title : undefined);
	});
}

function gistup(title, resolve, reject) {
	const gistupPath = path.join(__dirname, '../node_modules/gistup/bin/gistup');
	const gistupArgs = title ? `--description "${title}"` : '';

	if (!title) {
		console.log(chalk.dim('\nPublishing block with no title...\n'));
	} else {
		console.log(chalk.dim(`\nPublishing block "${title}"...\n`));
	}

	// run gistup with description arg if title is provided
	child.exec(`${gistupPath} ${gistupArgs}`, function(error, stdout, stderr) {
		if (error) {
			reject(error);
		}

		if (stderr) {
			process.stderr.write(stderr);
		}

		if (stdout) {
			process.stdout.write(stdout);
		}

		// extract the hash from the standard error message and use it to create the blocks URL
		const gistHash = stderr.match(/To git@gist.github.com:([a-z0-9]+).git/)[1]
		if (gistHash) {
			const blockUrl = `https://bl.ocks.org/${gistHash}`;
			console.log(chalk.bold('\nBlock published! You can view it at', chalk.bold.blue(blockUrl)));
		} else {
			console.log(chalk.bold('\nBlock published!'));
		}

		console.log(chalk.dim('\nThis directory is now a git repository. To update your block, ' +
			'use standard git commands.\n'));

		resolve();
	});
}
