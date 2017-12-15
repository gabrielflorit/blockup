var fs = require('fs-extra')
var path = require('path')
var chalk = require('chalk')

module.exports = function () {
  console.log(chalk.green('Scaffolding a new block... done.'))

  // Copy files to destination directory.
  fs.copySync(path.join(__dirname, '../template'), path.join(process.cwd()))
}
