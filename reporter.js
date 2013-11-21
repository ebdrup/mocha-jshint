var path = require('path');
module.exports = function (results) {
	results.forEach(function (result) {
		var file = result.file;
		var error = result.error;
		describe("JSHint of file " + file, function () {
			it("should pass", function () {
				var err = new Error("JSHint error: " + error.reason);
				err.stack = ' at (' + path.resolve(file) + ':' + error.line + ':' + error.character + ')';
				throw err;
			});
		});
	});
	if (results.length === 0) {
		describe("JSHint", function () {
			it("should pass", function () {
			});
		});
	}
};