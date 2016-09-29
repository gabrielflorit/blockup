var notify = require('gulp-notify')
var gutil = require('gulp-util')

module.exports = function(error) {

	var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : ''

	notify({
		title: 'Task failed [' + error.plugin + ']',
		message: lineNumber + 'See terminal.',
		sound: 'Sosumi'
	}).write(error)

	gutil.beep()

	var report = ''
	var chalk = gutil.colors.white.bgRed

	report += chalk('TASK:') + ' [' + error.plugin + ']\n'
	report += chalk('PROB:') + ' ' + error.message + '\n'

	if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n' }

	if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n' }

	console.error(report)

	this.emit('end')
}
