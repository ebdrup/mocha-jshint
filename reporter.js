var path = require('path');
module.exports = function (err) {
	return function (results) {
		results.forEach(function (result) {
			var file = result.file;
			var error = result.error;
			if (err.message) {
				err.message += '\n';
				err.stack += '\n';
			}
			err.message += 'JSHint error: ' + error.reason + ' ' + file + ':' + error.line + ':' + error.character;
			err.stack += error.reason + '\n at (' + path.resolve(file) + ':' + error.line + ':' + error.character + ')';
		});
	};
};