gulp = require('gulp');
gutil = require('gulp-util');
coffee = require('gulp-coffee');
watch = require('gulp-watch')

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
