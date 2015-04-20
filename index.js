var path = require('path');
var jsHintCliPath = path.resolve(path.dirname(require.resolve('jshint')), 'cli.js');
delete require.cache[jsHintCliPath];
var jsHint = require(jsHintCliPath);
var Reporter = require('./reporter.js');

function createTest(files){
	return function (done) {
		var reporter = new Reporter();
		var options = {
			args: files,
			verbose: true,
			reporter: reporter.report
		};

		if (files.length === 0) {
			return done();
		}

		this.timeout && this.timeout(30000);
		jsHint.run(options);
		if (reporter.error.message) {
			return done(reporter.error);
		}
		return done();
	};
}

module.exports = function (opt) {
	opt = opt || {};
	describe(opt.title || 'jshint', function () {
		var files = ['.'];		

		if (opt.git) {
			return require('./git')(opt.git, run);	
		} else if (opt.files) {
			files = opt.files;
			if (typeof files === 'string') {
				files = [files];
			}
		}

		return run(null, files);

		function run(err, files) {
			before(function(){
				if (err) {
					throw err;
				}
			});
			
			if (opt.git) {
				it('should pass for working directory', createTest(files));
			} else {
				files.forEach(function (file) {
					it('should pass for ' + JSON.stringify(path.resolve(file)), createTest([file]));
				});
			}
		}
	});
};