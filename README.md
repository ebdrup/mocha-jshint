mocha-jshint
---

Run JSHint as Mocha tests.

To install in your node.js project as devDependency, run this command, in the root of your project
```
npm install mocha-jshint --save-dev
```

usage
-----
Mocha defaults to looking for your test specs in the `test` folder of yoour project.
Add this file as `test/JSHint.spec.js` in your project, with the following content:

```js
require('mocha-jshint')();
```

That is it you are done.

To grep only the JSHint test, just do
```
mocha --grep JSHint
```

Why?
---
This module was created to:

- Make adding JSHint testing to a project using Mocha as easy as possible
- Make it easy to piggyback on all the different Mocha reporters (dot, spec, teamcity etc) for JSHint output
- Make sure that you get a click-able link directly to the problem in WebStorm, when JSHint fails
- Make sure that there is no unnecessary noise in the test output