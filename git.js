var exec = require('child_process').exec;
var format = require('util').format;
var uniq = require('uniq');
var path = require('path');
var fs = require('fs');
var shjs = require("shelljs");
var minimatch = require("minimatch");

module.exports = function (options, cb) {
	if (!options.modified && !options.commits) {
		cb(new Error('git options need to have either options.modified:true or have options.commits>0'));
	}
	if (options.masterDiff) {
		return exec('git rev-parse --abbrev-ref HEAD', options.exec, getFilesChangesInCurrentBranch);
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
		return exec(command, options.exec, returnFiles);
	}

	function compareLatestCommits() {
		var maxCount = (options.commits || 0) + 1;
		return exec(format('git log --pretty=format:%h --max-count=%d', maxCount), options.exec, findSHA);
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
		return exec(command, options.exec, returnFiles);
	}

	function returnFiles(err, stdout) {
		if (err) {
			return cb(err);
		}
		var jsHintIgnores = [];
		try {
			jsHintIgnores = fs.readFileSync(path.resolve('.jshintignore'), 'utf-8')
				.split('\n')
				.filter(function (line) {
					return !!line.trim();
				})
				.map(function (line) {
					if (line[0] === "!") {
						return "!" + path.resolve(line.substr(1).trim());
					}
					return path.resolve(line.trim());
				});
		} catch (ex) {
		}
		var files = uniq(stdout.split('\n'))
			.filter(function (filename) {
				return filename.split('.').pop() === 'js';
			})
			.filter(function (filename) {
				return !isIgnored(filename, jsHintIgnores);
			})
			.filter(function (filename) {
				return fs.existsSync(path.resolve(filename));
			});
		return cb(null, files);

		function isIgnored(fp, patterns) {
			return patterns.some(function (ip) {
				if (minimatch(path.resolve(fp), ip, {nocase: true})) {
					return true;
				}
				if (path.resolve(fp) === ip) {
					return true;
				}
				if (shjs.test("-d", fp) && ip.match(/^[^\/]*\/?$/) &&
					fp.match(new RegExp("^" + ip + ".*"))) {
					return true;
				}
			});
		}
	}
};
