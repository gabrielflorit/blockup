#!/usr/bin/env node

var pakage = require('./../package.json')
var path = require('path')
var newBlock = require('./newBlock.js')
var fs = require('fs')
var gulp = require('gulp')
var bs = require('browser-sync').create()
var rename = require('gulp-rename')
var buble = require('gulp-buble')
var plumber = require('gulp-plumber')
var reportError = require('./reportError.js')
var uglify = require('gulp-uglify')
var chalk = require('chalk')
var stylus = require('gulp-stylus')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')

var argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'scaffold and serve a new block (default if directory is empty)')
	.command('serve', 'serve current block (default if directory is not empty)')

	.demand(0, 'asdf')

	.help('h')
	.alias('h', 'help')
	.version()
	.argv

gulp.task('default', ['watch', 'serve'])

// Watch index.html and script.js.
gulp.task('watch', function() {

	gulp.watch('index.html', { cwd: process.cwd() }, bs.reload)
	gulp.watch('script.js', { cwd: process.cwd() }, ['script'])
	gulp.watch('style.styl', { cwd: process.cwd() }, ['stylus'])

})

// Start Browsersync.
gulp.task('serve', function() {

	bs.init({
		open: false,
		server: {
			baseDir: process.cwd(),
			index: 'index.html'
		},
		notify: false,
	})

})

// Compile, uglify, and reload JS.
gulp.task('script', function() {

	return gulp.src(path.join(process.cwd(), 'script.js'))
		.pipe(plumber({ errorHandler: reportError }))
		.pipe(buble())
		.pipe(uglify())
		.pipe(rename('dist.js'))
		.pipe(gulp.dest('.'))
		.pipe(bs.reload({ stream: true }))

})

// Compile and reload stylus.
gulp.task('stylus', function() {

	return gulp.src(path.join(process.cwd(), 'style.styl'))
		.pipe(plumber({ errorHandler: reportError }))
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(rename('dist.css'))
		.pipe(gulp.dest('.'))
		.pipe(bs.reload({ stream: true }))

})

const serveBlock = () => {

	console.log(chalk.green('Serving current block:'))
	gulp.start('default')
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
