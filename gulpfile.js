'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass');
var cssmin        = require('gulp-cssmin');
var mocha         = require('gulp-spawn-mocha');
var concat        = require('gulp-concat');
var rename        = require('gulp-rename');
var uglify        = require('gulp-uglify');
var jshint        = require('gulp-jshint');
var webpack       = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
var stylish       = require('jshint-stylish');
var rimraf        = require('rimraf');
var merge         = require('event-stream').merge;
var pkg           = require('./package.json');


var dirs = {
  cssSrc: './resource/css',
  cssDist: './public/css',
  jsSrc: webpackConfig.dir.js,
  jsDist: webpackConfig.dir.jsDist,
};

var tests = {
  watch: ['test/**/*.test.js'],
}

var css = {
  src: dirs.cssSrc + '/' + pkg.name + '.scss',
  main: dirs.cssDist + '/crowi-main.css',
  dist: dirs.cssDist + '/crowi.css',
  watch: ['resource/css/*.scss'],
};

var js = {
  src: [
    'resource/js/crowi.js'
  ],
  dist: dirs.jsDist + '/crowi-main.js',
  revealDist: dirs.jsDist + '/crowi-reveal.js',
  componentsDist: dirs.jsDist + '/crowi-components.js',
  clientWatch: ['resource/js/**/*.js'],
  watch: ['test/**/*.test.js', 'app.js', 'lib/**/*.js'],
  lint: ['app.js', 'lib/**/*.js'],
  tests: tests.watch,
};

var cssIncludePaths = [
  'bower_components/bootstrap-sass-official/assets/stylesheets',
  'bower_components/fontawesome/scss',
  'bower_components/reveal.js/css'
];

gulp.task('js:clean', function(cb) {
  rimraf(dirs.jsDist, cb);
});

gulp.task('js:webpack', ['js:clean'], function() {
  return gulp.src('')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(webpackConfig.dir.jsDist));
});

gulp.task('js:min', ['js:webpack'], function() {
  return merge(
    gulp.src(js.revealDist)
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dirs.jsDist))
      ,
    gulp.src(js.componentsDist)
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dirs.jsDist))
      ,
    gulp.src(js.dist)
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dirs.jsDist))
  );
});

gulp.task('jshint', function() {
  return gulp.src(js.lint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', function() {
  return gulp.src(js.tests)
    .pipe(mocha({
      r: 'test/bootstrap.js',
      globals: ['chai'],
      R: 'dot',
    }));
});

gulp.task('css:sass', function() {
  return gulp.src(css.src)
    .pipe(sass({
        outputStyle: 'nesed',
        sourceComments: 'map',
        includePaths: cssIncludePaths
    }).on('error', sass.logError))
    .pipe(rename({suffix: '-main'}))
    .pipe(gulp.dest(dirs.cssDist));
});

gulp.task('css:concat', ['css:sass'], function() {
  return gulp.src([css.main, 'bower_components/highlightjs/styles/tomorrow-night.css'])
    .pipe(concat('crowi.css'))
    .pipe(gulp.dest(dirs.cssDist))
});

gulp.task('css:min', ['css:concat'], function() {
  return gulp.src(css.dist)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirs.cssDist));
});

gulp.task('watch', function() {
  var watchLogger = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  };

  var cssWatcher = gulp.watch(css.watch, ['css:concat']);
  cssWatcher.on('change', watchLogger);
  var jsWatcher = gulp.watch(js.clientWatch, ['js:webpack']);
  jsWatcher.on('change', watchLogger);
  var testWatcher = gulp.watch(js.watch, ['test']);
  testWatcher.on('change', watchLogger);
});

gulp.task('css', ['css:sass', 'css:concat',]);
gulp.task('default', ['css:min', 'js:min',]);
gulp.task('dev', ['css:concat', 'js:webpack','jshint', 'test']);

