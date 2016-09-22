#!/usr/bin/env node

var package = require('./../package.json')
var newBlock = require('./newBlock.js')
var serveBlock = require('./serveBlock.js')

var argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'scaffold a new block')
	.command('serve', 'serve current block')

	.demand(1)

	.help('h')
	.alias('h', 'help')
	.epilog('v'  + package.version)
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

	default:
		break
}
