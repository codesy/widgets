var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');


options = {
    uglify: { 
      mangle: true, 
      compress:{
        sequences     : true,  // join consecutive statemets with the “comma operator”
        properties    : true,  // optimize property access: a["foo"] → a.foo
        dead_code     : true,  // discard unreachable code
        drop_debugger : true,  // discard “debugger” statements
        unsafe        : false, // some unsafe optimizations (see below)
        conditionals  : true,  // optimize if-s and conditional expressions
        comparisons   : true,  // optimize comparisons
        evaluate      : true,  // evaluate constant expressions
        booleans      : true,  // optimize boolean expressions
        loops         : true,  // optimize loops
        unused        : true,  // drop unused variables/functions
        hoist_funs    : true,  // hoist function declarations
        hoist_vars    : false, // hoist variable declarations
        if_return     : true,  // optimize if-s followed by return/continue
        join_vars     : true,  // join var declarations
        cascade       : true,  // try to cascade `right` into `left` in sequences
        side_effects  : true,  // drop side-effect-free statements
        warnings      : true
      } 
    },
};

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('coffee', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./js/'))
});


gulp.task('watch', function() {
  gulp.watch('./src/*.coffee',['coffee'])
});


gulp.task('minify', function () {
    gulp.src('./js/*.js')
      .pipe( uglify( options.uglify ) )
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./pkg'));
});