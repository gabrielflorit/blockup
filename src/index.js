#!/usr/bin/env node

var path = require('path')
var newBlock = require('./newBlock.js')
var fs = require('fs')
var gulp = require('gulp')
var bs = require('browser-sync').create()
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var reportError = require('./reportError.js')
var chalk = require('chalk')
var stylus = require('gulp-stylus')
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css')
var webpack = require('webpack')
var webpackStream = require('webpack-stream')
var webpackConfig = require('./webpack.config.js')

var checkMissingFiles = require('./checkMissingFiles')
var publish = require('./publish')

var argv = require('yargs')
  .usage('Usage: $0 <command>')
  .command(
    'new',
    'scaffold and serve a new block (default if directory is empty)'
  )
  .command('serve', 'serve current block (default if directory is not empty)')
  .command('check', 'check if any expected files are missing')
  .command('publish', 'publish this block as a gist via gistup')
  .demand(0, 'asdf')
  .help('h')
  .alias('h', 'help')
  .version().argv

gulp.task('default', ['watch', 'serve'])

// Watch index.html and script.js.
gulp.task('watch', function () {
  gulp.watch('index.html', { cwd: process.cwd() }, bs.reload)
  gulp.watch(['*.js', '!dist.js'], { cwd: process.cwd() }, ['script'])
  gulp.watch('style.styl', { cwd: process.cwd() }, ['stylus'])
})

// Start Browsersync.
gulp.task('serve', function () {
  bs.init({
    server: {
      baseDir: process.cwd(),
      index: 'index.html'
    },
    notify: false,
    ghostMode: false
  })
})

// Compile and reload JS.
gulp.task('script', function () {
  return gulp
    .src(path.join(process.cwd(), 'script.js'))
    .pipe(plumber({ errorHandler: reportError }))
    .pipe(
      webpackStream(webpackConfig, webpack, function (error, stats) {
        if (error) {
          console.error(error)
        } else {
          var time = stats.toJson().time
          console.log('Built in ' + time + 'ms.')
        }
      })
    )
    .pipe(rename('dist.js'))
    .pipe(gulp.dest('.'))
    .pipe(bs.reload({ stream: true }))
})

// Compile and reload stylus.
gulp.task('stylus', function () {
  return gulp
    .src(path.join(process.cwd(), 'style.styl'))
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
  // Create a new block and start the dev server
  case 'new': {
    newBlock()
    serveBlock()
    break
  }

  // Start the dev server
  case 'serve': {
    serveBlock()
    break
  }

  // Check for expected block files
  case 'check': {
    checkMissingFiles()
    break
  }

  // Publish the block via gistup. Performs a few safety checks first.
  case 'publish': {
    publish()
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
