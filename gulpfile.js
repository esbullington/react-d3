console.time('Loading plugins');

// require('time-require');

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  del = require('del')
  ;

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');


plugins.browserSync = require('browser-sync')
plugins.merge = require('merge-stream');

console.timeEnd('Loading plugins');

var config = {
  production: true
};

gulp.task('clean:build', function() {
  del.sync(['build'], { force: true} );
  //return del(['build'], { force : true }, cb); this one fails so using the sync option
});

function bundler(entry) {
  // var es6ify = require('es6ify');
  var globalShim = require('browserify-global-shim').configure({
    "react": "React",
    "d3": "d3"
  });
  var opts = {
          entries: entry // Only need initial file, browserify finds the deps
          //, transform: [reactify] // adding transform here does not give the react transforms, so add it as a .transform()
          , standalone: 'rd3' // enable the build to have UMD and expose window.rsc if no module system is used
          , extensions: [ '.jsx', '.js' ]
          , fullPaths: false
          //, external: ["react", "d3"]
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
    .transform(reactify, { harmony : true } ) // We want to convert JSX to normal javascript
    .transform(globalShim) // We want to convert JSX to normal javascript
    ;
/**/
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
        plugins.browserSync.reload();
      }
    })
  .on('error', console.error.bind(console));

  return bundleShare(w);
}

function bundleShare(b) {
  return b.bundle()
    .pipe(source('main.js')) // TODO change this to react-d3.js after the npm run scripts are retired and changing docs/public/index.html to use react-d3.js instead of main.js
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public/js'));
}


var data = gulp.src('dist/public/data/*').pipe(gulp.dest('build/public/data'));

var html = gulp.src('dist/public/*.html').pipe(gulp.dest('build/public'));

gulp.task('copy', function() {
  return plugins.merge(data, html);
});

gulp.task('docs', ['clean:build'], function() {
  return plugins.merge(data, html, compileJS(["./docs/examples/main.js"]));
});

gulp.task('watch', ['clean:build', 'serve'], function() {
  config.production = false;
  compileJS(["./docs/examples/main.js"]);
  gulp.watch('dist/public/data/*', [data], reload);
  gulp.watch('dist/public/*.html', [html], reload);

});

gulp.task('minified', ['clean:build'], function() {
  var gulpFilter = require('gulp-filter');
  var jsfilter = gulpFilter(['*.js']);

  compileJS(["./src/index.js"])
    .pipe(jsfilter)
    .pipe(plugins.rename({ extname: '.min.js' }))
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/js'))
    ;

  var copyMin = gulp.src('build/public/js/*').pipe(gulp.dest('dist/public/js'));
});

gulp.task('release', ['minified'], function() {
  // FIXME
  // why do jsx --harmony -x jsx src build/cjs && jsx --harmony src build/cjs
  // if needed, have to figure out how to use or use gulp-react plugin

  // var reactTools = require('react-tools');
  // reactTools.transform(sourceCodeAsString, options);

  var fs  = require("fs");
  var Handlebars = require('handlebars');
  var path = require('path');

  var pkg = require(path.join(__dirname, 'package.json'));

  var mkdirp = require('mkdirp');

  mkdirp(path.join(__dirname, 'build', 'cjs'), function(err) {
    var packageTemplate = fs.readFileSync(path.join(__dirname, 'dist/cjs/package.json')).toString();
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
  });
});

function reload(updateEvent, buildTime) {
  if (buildTime) {
    console.log('%s updated, bundle updated in %s ms', updateEvent, buildTime);
  } else {
    console.log("%s updated", updateEvent.path);
  }

  plugins.browserSync.reload();
}

gulp.task('serve', function() {
  plugins.browserSync({
    server: {
      baseDir: ["build/public"]
    },
    ui: {
      port: 9080
    },
    port: 4000
  });
});

gulp.task('test', function (cb) {
  var karma = require('karma').server;

  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, cb);
});

gulp.task('lint', function () {
  // FIXME this does not work as the gulp-jsxhint plugin is not ready, figure out a different way to fix this
  var jsxhint = require('gulp-jsxhint');

  return gulp.src(['src/**/*.js', 'src/**/*.jsx']).
    pipe(jsxhint());

});


gulp.task("default", function() {
  console.log("gulp docs        -> To build the docs folder");
  console.log("gulp watch       -> Launch a web browser on localhost:4000 and also watche for changes to src/**/*.js(x)?, dist/public/*.html, dist/public/data/*");
  console.log("gulp minified    -> compile the javascript with entry as src/index.js and create dist/public/js/react-d3.min.js");
  console.log("gulp release     -> FIXME****** currently only generates the package.json under dist/cjs/ ** what is the purpose of this?");
  console.log("gulp clean:build -> clean the build directory");
  console.log("gulp serve       -> Launch a web browser on localhost:4000 and server from 'build/public'");
  console.log("gulp test        -> execute the tests with config file karma.conf.js");
  console.log("gulp lint        -> FIXME****** the plugin is not available for use, need to figure out some other option");
});
