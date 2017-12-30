var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  serve = require('gulp-serve'),
  connect = require('gulp-connect'),
  rev = require('gulp-rev-append');

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

jsPaths = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/what-input/what-input.js',
  'bower_components/foundation-sites/dist/foundation.min.js',
  'js/app.js'
];


gulp.task('serve', serve('.'));

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('bundleJS', function () {
  return gulp.src(jsPaths)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('js'))
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(sourcemaps.write('/map'))
    .pipe(gulp.dest('js'));
});

gulp.task('rev', function () {
  gulp.src('./index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});


gulp.task('sass', function () {
  return gulp.src(['scss/app.scss', 'scss/global.scss'])
    .pipe($.sass({
        includePaths: sassPaths
      })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('default', ['sass', 'connect', 'bundleJS', 'rev'], function () {
  gulp.watch(['scss/**/*.scss'], ['sass', 'rev']);
  gulp.watch(['js/app.js'], ['bundleJS', 'rev']);
  gulp.watch(['*.html'], ['html', 'rev']);
});