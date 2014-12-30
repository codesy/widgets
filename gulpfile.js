var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var zip = require('gulp-zip');


gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('coffee', function() {
  gulp.src('src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('js/'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.coffee',['coffee'])
});

gulp.task('publish', function () {    
  gulp.src('js/*.js')
    .pipe(stripDebug())
    .pipe(gulp.dest('js/'))

  gulp.src([
       'css/*',
       'img/*',
       'js/*.js',
       'manifest.json',
       'options.html',
      ], {base: "."})
    .pipe(zip('codesy.zip'))
    .pipe(gulp.dest('pkg/'));
});