var jsHint = require("./node_modules/jshint/src/cli.js");
module.exports = function (paths) {
	describe("JSHint", function () {
		paths = paths || ['.'];
		paths.forEach(function (p) {
			it("should pass for " + (p === '.' ? 'working directory' : p), function () {
				var error = new Error('');
				error.message = '';
				error.stack = '';
				var options = {
					args: [p],
					reporter: require('./reporter.js')(error)
				};
				jsHint.run(options);
				if (error.message) {
					throw error;
				}
			});
		});
	});
};
