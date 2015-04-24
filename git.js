var exec = require('child_process').exec;
var format = require('util').format;
var uniq = require('uniq');
var path = require('path');
var fs = require('fs');

module.exports = function (options, cb) {
	if (!options.modified && !options.commits) {
		cb(new Error('git options need to have either options.modified:true or have options.commits>0'));
	}
	if (options.masterDiff) {
		return exec('git rev-parse --abbrev-ref HEAD', getFilesChangesInCurrentBranch);
	}
	return compareLatestCommits();

	function getFilesChangesInCurrentBranch(err, stdout) {
		if (err) {
			return cb(err);
		}
		var branch = stdout.trim();
		if (branch === 'master' || branch === 'HEAD') {
			return compareLatestCommits();
		}
		var command = format('git diff --name-only "master...%s"', branch);
		if (options.modified) {
			command += ' && git diff --name-only HEAD';
		}
		return exec(command, returnFiles);
	}

	function compareLatestCommits() {
		var maxCount = (options.commits || 0) + 1;
		return exec(format('git log --pretty=format:%h --max-count=%d', maxCount), findSHA);
	}

	function findSHA(err, stdout) {
		if (err) {
			return cb(err);
		}
		var shas = stdout.split('\n').filter(Boolean);
		var command = '';
		if (shas.length) {
			command += format('git diff --name-only %s %s', shas[0], shas[shas.length - 1]);
		}
		if (options.modified) {
			command += ((!!command) ? ' && ' : '') + 'git diff --name-only HEAD';
		}
		if (!command) {
			return cb(null, []);
		}
		return exec(command, returnFiles);
	}

	function returnFiles(err, stdout) {
		if (err) {
			return cb(err);
		}
		var files = uniq(stdout.split('\n'))
			.filter(function (filename) {
				return filename.split('.').pop() === 'js';
			})
			.filter(function(filename){
				return fs.existsSync(path.resolve(filename));
			});
		return cb(null, files);
	}
};
