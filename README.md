mocha-jshint [![npm version](https://badge.fury.io/js/mocha-jshint.svg)](http://badge.fury.io/js/mocha-jshint) [![Build Status](https://travis-ci.org/ebdrup/mocha-jshint.svg?branch=master)](https://travis-ci.org/ebdrup/mocha-jshint) [![Dependency Status](https://david-dm.org/ebdrup/mocha-jshint.svg)](https://david-dm.org/ebdrup/mocha-jshint) [![devDependency Status](https://david-dm.org/ebdrup/mocha-jshint/dev-status.svg)](https://david-dm.org/ebdrup/mocha-jshint#info=devDependencies)
------------

Run jshint as Mocha tests.

To install in your node.js project as devDependency, run this command, in the root of your project
```
npm install mocha-jshint --save-dev
```

usage
-----
Mocha defaults to looking for your test specs in the `test` folder of your project.
Add this file as `test/jshint.spec.js` in your project, with the following content:

```js
require('mocha-jshint')();
```

That is it you are done.

To grep only the jshint test, just do
```
mocha --grep jshint
```

using with git
--------------
If you are using git as version control you can do the following in your test:
```js
require('mocha-jshint')({
	git: {
		modified: true,
		commits: 2
	}
});
```
This means that jshint will only lint the files that are modified on disk according to git, and the files modified in the last 
two git commits.

There is also the `masterDiff` option:
```js
require('mocha-jshint')({
	git: {
		modified: true,
		commits: 2,
		masterDiff:true
	}
});
```
This means that if we are on any other branch than `master`, only the files changed compared to the `master` branch
will be linted.

If we are on the `master` branch, only the files that are modified on disk according to git, and the files modified in the last 
two git commits will be linted.


configuring jshint
------------------
In the root of your project you can add a `.jshintignore` file, where each line is a file or directory for jshint to ignore
and not check for errors. (see this project for an example)

At the root of your project you can add a `.jshintrc` file, that specifies what options you want jshint to run with
(see this project for an example)

You can also add a `.jshintrc` file to any subdirectory of your project, to override the .jshintrc settings in the root.
For example in this project I allow some global variables in the `test` folder. Global variables that are set when I
run mocha tests. Global variables that are only allowed to be used, in the .js files in the test folder

Why?
---
This module was created to:

- Make adding jshint testing to a project using Mocha as easy as possible
- Make it easy to piggyback on all the different Mocha reporters (dot, spec, teamcity etc) for jshint output
- Make sure that you get a click-able link directly to the problem in WebStorm, when jshint fails
- Make sure that there is no unnecessary noise in the test output

Version history
---------------
2.1: Added git `masterDiff` option.
2.0: Added git features. Removed old undocumented paths feature.

License
--------
MIT
