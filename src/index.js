#!/usr/bin/env node

var pakage = require('./../package.json')
var newBlock = require('./newBlock.js')
var serveBlock = require('./serveBlock.js')
var fs = require('fs')

var argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'scaffold and serve a new block (default if directory is empty)')
	.command('serve', 'serve current block (default if directory is not empty)')

	.demand(0, 'asdf')

	.help('h')
	.alias('h', 'help')
	.epilog('v'  + pakage.version)
	.argv

var command = argv._[0]

switch (command) {

	case 'new': {

		newBlock()
		serveBlock()
		break

	}

	case 'serve': {

		serveBlock()
		break

	}

	default: {

		// Is this directory empty? If so, run `newBlock`.
		// Else run `serveBlock`.
		if (fs.readdirSync(process.cwd(), { encoding: 'utf8' }).length) {
			serveBlock()
		} else {
			newBlock()
			serveBlock()
		}

		break

	}

}
