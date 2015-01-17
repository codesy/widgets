var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var merge = require('merge-stream');
var zip = require('gulp-zip');
var jeditor = require("gulp-json-editor");

gulp.task('coffee', function() {
  gulp.src('src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('js/'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.coffee',['coffee'])
});

prod_manifest = function () {
  return gulp.src([
    'manifest.json'
    ], { cwd : "./prod"})
};

gulp.task('dev-manifest', function() {
  manifest = require('./prod/manifest.json')
  permissions = manifest.permissions || []
  content_scripts = manifest.content_scripts || []
  
  dev_domain  = "127.0.0.1"
  dev_port = '8443'

  permissions.push("https://" + dev_domain +":"+dev_port+"/")
  content_scripts[1].matches.push("*://"+dev_domain+":*/*")
  
  gulp.src("./prod/manifest.json")
    .pipe(jeditor({
      'DEV_WARNING': 'THIS IS NOT the production manifest; use prod/manifest.json for permanent changes to manifest.json'
    }))
    .pipe(jeditor({
      'permissions': permissions
    }))
    .pipe(jeditor({
      'content_scripts': content_scripts
    }))
    .pipe(gulp.dest("./"));

});

gulp.task('dev-start',['coffee','dev-manifest'])

gulp.task('dev-stop',function () {
  prod_manifest()
    .pipe(gulp.dest("./"))
})

gulp.task('strip_debug',function () {
  gulp.src('js/*.js')
    .pipe(stripDebug())
    .pipe(gulp.dest('js/'))
})

gulp.task('zip_extension', function () { 
  manifest = prod_manifest()
  others = gulp.src([
    'css/*',
    'img/*',
    'js/*.js',
    'options.html',
    ], { base : "."})
      
  merge (manifest,others)
    .pipe(zip('codesy.zip'))
    .pipe(gulp.dest('prod'));
});

gulp.task('publish',['coffee','strip_debug','zip_extension']);
