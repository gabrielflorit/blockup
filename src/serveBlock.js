var fs = require('fs-extra')
var path = require('path')
var bs = require('browser-sync').create()
var buble = require('buble')
var chalk = require('chalk')

module.exports = function() {

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
