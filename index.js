var jsHint = require("./node_modules/jshint/src/cli.js");
module.exports = function (paths) {
	paths = paths || ['.'];
	paths.forEach(function (p) {
		var options = {
			args: [p],
			reporter: require('./reporter.js')
		};
		jsHint.run(options);
	});
};