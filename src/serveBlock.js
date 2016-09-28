var fs = require('fs-extra')
var path = require('path')
var bs = require('browser-sync').create()
var buble = require('buble')
var chalk = require('chalk')
var UglifyJS = require('uglify-js')
var cheerio = require('cheerio')

module.exports = function() {

	console.log(chalk.green('Serving current block:'))

	// Watch index.html and reload.
	bs.watch(path.join(process.cwd(), 'index.html')).on('change', bs.reload)

	// Watch script.js, compile, uglify, inline, and reload.
	bs.watch(path.join(process.cwd(), 'script.js'), function (event, file) {
		if (event === 'change') {

			var contents = fs.readFileSync(file, { encoding: 'utf8' })
			var output = buble.transform(contents)
			var uglified = UglifyJS.minify(output.code, { fromString: true })
			var html = fs.readFileSync(path.join(process.cwd(), 'index.html'), {
				encoding: 'utf8'
			})

			var $ = cheerio.load(html)

			$('#script').text(uglified.code)

			fs.writeFileSync(path.join(process.cwd(), 'index.html'), $.html())

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
