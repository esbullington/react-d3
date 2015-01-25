'use strict';

var fs  = require("fs");
var _ = require('lodash');
var pkg = require('../package.json');

function build_task() {
  var packageTemplate = fs.readFileSync('./dist/cjs/package.json').toString();
  var buildPackage = _.template(packageTemplate, {pkg: pkg});
  try {
    JSON.parse(buildPackage);
  } catch (err) {
    console.error('package.json parse error: ', err);
    process.exit(1);
  }
  fs.writeFileSync('./build/cjs/package.json', buildPackage);
  console.log('CJS package.json file rendered');
}

if (require.main === module) {
    build_task();
}
