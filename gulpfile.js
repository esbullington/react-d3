console.time('Loading plugins');

// require('time-require');

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserSync = require('browser-sync'),
  merge = require('merge-stream'),
  chalk = require('chalk'),
  karma = require('karma').server;

console.timeEnd('Loading plugins');

var config = {
  production: true
};

gulp.task('clean:build', function() {
  var del = require('del');

  del.sync(['build/'], { force: true} );
  //return del(['build'], { force : true }, cb); this one fails so using the sync option
});

function bundler(entry) {
  var babelify = require('babelify'),
      watchify = require('watchify'),
      browserify = require('browserify');

  var globalShim = require('browserify-global-shim').configure({
    "react": "React",
    "d3": "d3"
  });
  var opts = {
          entries: entry // Only need initial file, browserify finds the deps
          , standalone: 'rd3' // enable the build to have UMD and expose window.rsc if no module system is used
          , extensions: [ '.jsx', '.js' ]
          , fullPaths: false
        };
  if (!config.production) {
    //opts.entries = watchEntry // building the demo
    opts.debug = true // Gives us sourcemapping
    opts.cache = {}; // Requirement of watchify
    opts.packageCache = {}; // Requirement of watchify
    opts.fullPaths = true; // Requirement of watchify
  }

  var bundler = browserify(opts);

  bundler
    .external(["react", "d3"]) // this informs browserify that when you see require("react") or require("d3") it will be available, trust me
    .transform(babelify) // We want to convert JSX to normal javascript
    .transform(globalShim) // replace require('react') and require('d3') with (window.React) and (window.d3)
    ;

  return config.production ? bundler : watchify(bundler);
}

function compileJS(entry) {

  var w = bundler(entry);

  if (!config.production) {
    w.on("update", function (e) {
      var updateStart = Date.now();

      bundleShare(w);
      console.log('file changed %s', e)
    });
  }

  // called on completion of build
  w.on('time', function (time) {
      if (!config.production) {
        console.log('Bundle updated in %s ms', time);
        browserSync.reload();
      }
    })
  .on('error', console.error.bind(console));

  return bundleShare(w);
}

function bundleShare(b) {
  return b.bundle()
    .on('error', function(err){
      console.log(chalk.red(err.toString()));
      this.end();
    })
    .pipe(source('react-d3.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public/js'));
}


var data = function() { return gulp.src('dist/public/data/*').pipe(gulp.dest('build/public/data')); }

var html = function() { return gulp.src('dist/public/*.html').pipe(gulp.dest('build/public')) };

gulp.task('copy', function() {
  return merge(data, html);
});

gulp.task('docs', ['clean:build'], function() {
  return merge(data(), html(), compileJS(["./docs/examples/main.js"]));
});

gulp.task('watch', ['clean:build', 'serve'], function() {
  config.production = false;
  compileJS(["./docs/examples/main.js"]);
  gulp.watch('dist/public/data/*', [data()], reload);
  gulp.watch('dist/public/*.html', [html()], reload);

});

gulp.task('minified', ['clean:build'], function() {
  config.production = true;
  var gulpFilter = require('gulp-filter');
  var jsfilter = gulpFilter(['*.js']);
  return compileJS(["./src/index.js"])
    .pipe(jsfilter)
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/js'))
    .pipe(gulp.dest('dist/public/js'))
    ;
});


gulp.task('copymisc', function(cb) {

  // replacement for jsx --harmony -x jsx src build/cjs && jsx --harmony src build/cjs
  var react = require('gulp-react');
  var npmAssets = gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(react({harmony: true}))
        .pipe(gulp.dest('build/cjs'));

  // replacement for cp *.md build/cjs && cp .npmignore build/cjs
  var misc = gulp.src(['*.md', '.npmignore'])
        .pipe(gulp.dest('build/cjs'));

  return merge(npmAssets, misc);
});


gulp.task('build', ['minified', 'docs']);

gulp.task('release', ['copymisc', 'minified'], function(cb) {

  var fs  = require("fs");
  var Handlebars = require('handlebars');
  var path = require('path');

  var pkg = require(path.join(__dirname, 'package.json'));

  // replacement for node scripts/build.js
  var packageTemplate = fs.readFileSync(path.join(__dirname, 'dist/cjs/package.json')).toString();
  var template = Handlebars.compile(packageTemplate);
  var buildPackage = template({pkg: pkg});
  try {
    JSON.parse(buildPackage);
  } catch (err) {
    console.error('package.json parse error: ', err);
    process.exit(1);
  }

  fs.writeFile(path.join(__dirname, 'build', 'cjs', 'package.json'), buildPackage, function(err) {
  if (err) console.log(err);
    else console.log('CJS package.json file rendered');
    cb();
  });
});

function reload(updateEvent, buildTime) {
  if (buildTime) {
    console.log('%s updated, bundle updated in %s ms', updateEvent, buildTime);
  } else {
    console.log("%s updated", updateEvent.path);
  }

  browserSync.reload();
}

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: ["build/public"]
    },
    ui: {
      port: 9080
    },
    port: 4000,
    open: false
  });
});

gulp.task('test', function (cb) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb);
});

gulp.task('tdd', function (cb) {
  console.log("Running TDD");
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, cb);
});

gulp.task('lint', function () {
  var jshint = require('gulp-jshint');
  var react = require('gulp-react');
  var stylish = require('jshint-stylish');

  var jshintConfig = {
    "browserify": true,
    "expr": true,
    "esnext": true,
    "eqnull": true,
    "globals": {
      "describe": false,
      "it": false,
      "before": false,
      "beforeEach": false,
      "after": false,
      "afterEach": false
    }
  }

  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
        .pipe(react({harmony: true}))
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish))
        ;
});


gulp.task("default", function() {
  console.log("gulp build       -> Build all");
  console.log("gulp docs        -> Build the docs folder");
  console.log("gulp watch       -> Watch for changes to src/**/*.js(x)?, dist/public/*.html, dist/public/data/*");
  // console.log("gulp minified    -> Compile the javascript with entry as src/index.js and create dist/public/js/react-d3.min.js");
  console.log("gulp release     -> Create a release for npm under build/cjs which can be pulished to npm");
  console.log("gulp clean:build -> Clean the build directory");
  console.log("gulp serve       -> Launch a web browser on localhost:4000 and server from 'build/public'");
  console.log("gulp test        -> Execute the tests once with config file karma.conf.js");
  console.log("gulp tdd         -> Execute the tests continuosly with config file karma.conf.js");
  console.log("gulp lint        -> Lint *.js and *.jsx code under src/");
});
