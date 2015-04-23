var path = require('path');
var format = require('util').format;
var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
delete require.cache[jsHintCliPath];
var jsHint = require(jsHintCliPath);

function runJSHint(files, cb) {
	var err = new Error('');
	err.message = '';
	err.stack = '';
	var options = {
		args: files,
		verbose: true,
		reporter: require('./reporter.js')(err)
	};
	jsHint.run(options);
	if (err.message) {
		return cb(err);
	}
	return cb();
}

module.exports = function (opt) {
	opt = opt || {};
	if (opt && opt.git) {
		return require('./git')(opt.git, run);
	}
	return run(null, ['.']);

	function run(err, paths) {
		describe(opt.title || 'jshint', function () {
			this.timeout && this.timeout(30000);
			if (!opt.paths) {
				return it('should pass for working directory', function (done) {
					if (err) {
						return done(err);
					}
					if (paths.length === 0) {
						return done();
					}
					runJSHint(paths, done);
				});
			}
			opt.paths.forEach(function (p) {
				it(format('should pass for %s', JSON.stringify(p)), function (done) {
					runJSHint([p], done);
				});

			});
		});
	}
};