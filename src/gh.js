var GitHub = require('github-api')
var q = require('d3-queue').queue
var child = require('child_process')

function gitInit(callback) {
	child.exec('git init', function(error, stdout, stderr) {
		if (!error && stderr) process.stderr.write(stderr), error = new Error('git init failed.')
		if (!error && stdout) process.stdout.write(stdout)
		callback(error)
	})
}

function gitAdd(callback) {
	child.exec('git add -A', function(error, stdout, stderr) {
		if (!error && stderr) process.stderr.write(stderr), error = new Error('git add failed.')
		if (!error && stdout) process.stdout.write(stdout)
		callback(error)
	})
}

function gitCommit(callback) {
	child.exec("git commit --allow-empty -m 'Initial blockup commit'", function(error, stdout, stderr) {
		if (!error && stderr) process.stderr.write(stderr), error = new Error('git commit failed.')
		if (!error && stdout) process.stdout.write(stdout)
		callback(error)
	})
}

function gitRemoteAdd(gistId, callback) {
	child.exec('git remote add --track master origin git@gist.github.com:' + gistId + '.git', function(error, stdout, stderr) {
		if (!error && stderr) process.stderr.write(stderr), error = new Error('git remote failed.')
		if (!error && stdout) process.stdout.write(stdout)
		callback(error)
	})
}

function gitPush(callback) {
	child.exec('git push -fu origin master', function(error, stdout, stderr) {
		if (!error && stderr) process.stderr.write(stderr)
		if (!error && stdout) process.stdout.write(stdout)
		callback(error)
	})
}

function createGist(token, callback) {

	var gh = new GitHub({
		token: token
	})

	var gist = gh.getGist() // not a gist yet
	var data = {
			public: true,
			description: 'My first gist',
			files: {
				'file1.txt': {
					content: "Aren't gists great!"
				}
			}
	}

	gist.create(data)
		.then(function(res) {
			callback(null, res.data.id)
		})
		.catch(function(err) {
			callback(err)
		})

}

module.exports = function(token) {

	q(1)
		.defer(gitInit)
		.defer(gitAdd)
		.defer(gitCommit)
		.defer(createGist, token)
		.await(function(error, _, _, _, gistId) {

			q(1)
				.defer(gitRemoteAdd, gistId)
				.defer(gitPush)
				.await(function(error) {
					if (error) throw error
					console.log('all done')
				})

		})

}
