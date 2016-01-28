/**
 * An error message formatter that groups output by file,
 * and orders groups by filename.
 *
 * Sample output:
 *
 *     Found 3 jshint error(s) in 2 file(s):
 *          /tmp/abc.js
 *                   1:1     Missing semicolon. (W033)
 *                  18:0     Identifier 'good_times' is not in camel case. (W106)
 *
 *          /tmp/xyz.js
 *                   3:5     '_' is defined but never used. (W098)
 */

var path = require('path');

/** Base indent level; try to match mocha's output (brittle). */
var INDENT = '     ';

/** Stringify and left-pad `val` by `amount` spaces. */
function leftPad(val, amount) {
    amount = amount || 5;
    val = String(val);
    while (val.length < amount) {
        val = ' ' + val;
    }
    return val;
}

/** Stringify and right-pad `val` by `amount` spaces. */
function rightPad(val, amount) {
    amount = amount || 5;
    val = String(val);
    while (val.length < amount) {
        val = val + ' ';
    }
    return val;
}

module.exports = function (err) {
    return function (results) {
        if (!results.length) {
            return;
        }
        var errorsByFile = {};
        results.map(function (result) {
            var e = result.error;
            var fileName = path.resolve(result.file);
            if (!errorsByFile[fileName]) {
                errorsByFile[fileName] = [];
            }
            errorsByFile[fileName].push({
                reason: e.reason,
                code: e.code || '',
                line: e.line,
                character: e.character
            });
        });

        var fileList = Object.keys(errorsByFile).sort();
        var message = 'Found ' + results.length + ' jshint error(s) in ' + fileList.length + ' file(s):\n';

        fileList.map(function (fileName) {
            message += INDENT + INDENT + fileName + '\n';
            var errors = errorsByFile[fileName];
            errors.sort(function(a, b) {
                var val = a.line - b.line;
                if (val === 0) {
                    val = a.character - b.character;
                }
                return val;
            });

            errors.map(function (error) {
                var errorIndent = INDENT + INDENT + INDENT;
                var errorPosition = leftPad(error.line) + ':' + rightPad(error.character);

                message += errorIndent + errorPosition + ' ' + error.reason;
                if (error.code) {
                    message += ' (' + error.code + ')';
                }
                message += '\n';
            });
            message += '\n';
        });

        message = message.replace(/\n+$/, '');

        err.message = message;
    };
};
