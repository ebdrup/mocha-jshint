var path = require('path'),
	util = require('util');
module.exports = function (err) {
	return function (results) {
		results.forEach(function (result) {
			var file = result.file;
			var error = result.error;
			if (err.message) {
				err.stack += '\n';
			}
			err.message = err.message ||
				util.format('%s%s', error.reason, error.code ? ' (' + error.code + ')' : '') ||
				util.format('jshint error%s', results.length && 's' || '');
			err.stack += util.format('%s\n at (%s:%d:%d)', err.message, path.resolve(file), error.line, error.character);
		});
	};
};
