var path = require('path');
module.exports = function (opt) {
	describe('jshint', function () {
		it('should pass for working directory', function (done) {
			this.timeout && this.timeout(30000);
			if (opt && opt.git) {
				return require('./git')(opt.git, run);
			}
			return run(null, ['.']);

			function run(err, files) {
				if (err) {
					return done(err);
				}
				if (files.length === 0) {
					return done();
				}
				var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
				delete require.cache[jsHintCliPath];
				var jsHint = require(jsHintCliPath);
				var error = new Error('');
				error.message = '';
				error.stack = '';
				var options = {
					args: files,
					verbose: true,
					reporter: require('./reporter.js')(error)
				};
				jsHint.run(options);
				if (error.message) {
					return done(error);
				}
				return done();
			}
		});
	});
};