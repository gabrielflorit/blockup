#!/usr/bin/env node

var fs = require('fs-extra')
var path = require('path')
var bs = require('browser-sync').create()
var buble = require('buble')
var chalk = require('chalk')
var package = require('./package.json')

var argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'scaffold a new block')
	.command('serve', 'serve current block')

	.demand(1)

	.help('h')
	.alias('h', 'help')
	.epilog('v'  + package.version)
	.argv

var newBlock = () => {

	console.log(chalk.green('Scaffolding a new block... done.'))

	// Copy files to destination directory.
	fs.copySync(path.join(__dirname, 'src'), path.join(process.cwd()))

}

var serveBlock = () => {

	console.log(chalk.green('Serving current block:'))

	// Watch index.html and reload.
	bs.watch(path.join(process.cwd(), 'index.html')).on('change', bs.reload)

	// Watch main.es6.js, compile to index.js, and reload.
	bs.watch(path.join(process.cwd(), 'main.es6.js'), function (event, file) {
		if (event === 'change') {
			var contents = fs.readFileSync(file, { encoding: 'utf8' })
			var output = buble.transform(contents)
			fs.writeFileSync(path.join(process.cwd(), 'index.js'), output.code)
			bs.reload()
		}
	})

	bs.init({
		open: false,
		server: {
			baseDir: process.cwd(),
			index: 'index.html'
		}
	})

}

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
