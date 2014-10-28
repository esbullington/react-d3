
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '/home/eric/repos/react-d3-charts',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'browserify', 'chai', 'chai-as-promised'],

    // list of files / patterns to load in the browser
    files: [
      'utils/phantomjs-shims.js',
      'tests/index.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/index.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: [ 'reactify' ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    plugins: [
      'karma-*',
      // 'karma-chrome-launcher',
      // 'karma-jasmine',
      // 'karma-phantomjs',
      // 'karma-browserify'
    ],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 20000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  });
};
