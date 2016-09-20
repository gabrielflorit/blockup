#!/usr/bin/env node
var fs = require('fs-extra')
var path = require('path')
var bs = require('browser-sync').create()
var buble = require('buble')

// Copy files to destination directory.
fs.copySync(path.join(__dirname, 'src'), path.join(process.cwd()))

// Watch index.html and reload.
bs.watch(path.join(process.cwd(), 'index.html')).on('change', bs.reload)

// Watch index.es6.js, compile, and reload.
bs.watch(path.join(process.cwd(), 'index.js'), function (event, file) {
  if (event === 'change') {
    var contents = fs.readFileSync(file, { encoding: 'utf8' })
    var output = buble.transform(contents)
    fs.writeFileSync(path.join(process.cwd(), 'dist.js'), output.code)
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
