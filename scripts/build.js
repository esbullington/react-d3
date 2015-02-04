'use strict';

var fs  = require("fs");
var Handlebars = require('handlebars');
var pkg = require('../package.json');

function buildTask() {
  var packageTemplate = fs.readFileSync('./dist/cjs/package.json').toString();
  var template = Handlebars.compile(packageTemplate);
  var buildPackage = template({pkg: pkg});
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
    buildTask();
}
