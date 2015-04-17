var exec = require('child_process').exec;
var format = require('util').format;
var uniq = require('uniq');

module.exports = function (options, cb) {
	if (!options.modified && !options.commits) {
		cb(new Error('git options need to have either options.modified:true or have options.commits>0'));
	}
	var maxCount = options.commits || 1;
	return exec(format('git log --pretty=format:%h --max-count=%d', maxCount), findSHA);

	function findSHA(err, stdout) {
		if (err) {
			return cb(err);
		}
		var shas = stdout.split('\n');
		var shaIndex = Math.min(options.commits || 0, shas.length - 1);
		var command = format('git diff --name-only %s %s', shas[0], shas[shaIndex]);
		if(options.modified){
			command += ' && git diff --name-only HEAD';
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
			});
		return cb(null, files);
	}
};

