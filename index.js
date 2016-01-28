var path = require('path');
var format = require('util').format;
var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
delete require.cache[jsHintCliPath];
var jsHint = require(jsHintCliPath);

function runJSHint(files, cb, pretty) {
	var err = new Error('');
	err.message = '';
	err.stack = '';
	var options = {
		args: files,
		verbose: true,
	};
	if (pretty) {
		options.reporter = require('./prettyReporter.js')(err);
	} else {
		options.reporter = require('./reporter.js')(err);
	}

	jsHint.run(options);
	if (err.message) {
		return cb(err);
	}
	return cb();
}

module.exports = function (opt) {
	opt = opt || {};
	if (!opt.git) {
		describe(opt.title || 'jshint', function () {
			this.timeout && this.timeout(90000);
			(opt.paths || ['.']).forEach(function (p) {
				it(format('should pass for %s', p === '.' ? 'working directory' : JSON.stringify(p)), function (done) {
					runJSHint([p], done, opt.pretty);
				});
			});
		});
	} else if (opt && opt.git) {
		describe(opt.title || 'jshint', function () {
			this.timeout && this.timeout(90000);
			return it('should pass for working directory', function (done) {
				return require('./git')(opt.git, run);

				function run(err, paths) {
					if (err) {
						return done(err);
					}
					if (paths.length === 0) {
						return done();
					}
					runJSHint(paths, done, opt.pretty);
				}
			});
		});
	}
};
