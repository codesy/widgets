var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var merge = require('merge-stream');
var zip = require('gulp-zip');
var jeditor = require("gulp-json-editor");
var shell = require('gulp-shell');
var rename = require('gulp-rename')
var runSequence = require('run-sequence');

dev_domain  = "127.0.0.1"
dev_port = '8443'

combine_js = function (target) {
  console.log("compile "+target+" coffee files")
  return gulp.src(['./src/'+target+'/*.coffee','./src/*.coffee'])
    .pipe(coffee({bare: true}).on('error', gutil.log))

};

// ninja foo funtion to return function based on destination directory
static_stream = function(dest) {
  this.dest = dest
  return (
    function(_this) {
      return function() {
        return gulp.src(['css/*', 'js/*.js', 'img/*.png'], {
          base: "./static",
          cwd: "./static"
        }).pipe(gulp.dest('./' + _this.dest ))
      }
    }
  )(this)
}

gulp.task('chrome-static', new static_stream("chrome"))

gulp.task('firefox-static',new static_stream("firefox"))

gulp.task('chrome-coffee', function() {
  combine_js("chrome").pipe(gulp.dest('./chrome/js'))
});

gulp.task('firefox-coffee', function() {
  return combine_js("firefox").pipe(gulp.dest('./firefox/js'))
});

gulp.task('chrome-manifest', function() {
  var manifest = JSON.parse(fs.readFileSync('./src/chrome/manifest.json'));
  var permissions = manifest.permissions || []
  var content_scripts = manifest.content_scripts || []
  
  permissions.push("https://" + dev_domain +":"+dev_port+"/")
  content_scripts[1].matches.push("*://"+dev_domain+":*/")
  
  gulp.src('./src/chrome/manifest.json')
    .pipe(jeditor({
      'DEV_WARNING': 'THIS IS NOT the production manifest; use src/chrome/manifest.json for permanent changes'
    }))
    .pipe(jeditor({
      'permissions': permissions
    }))
    .pipe(jeditor({
      'content_scripts': content_scripts
    }))
    .pipe(gulp.dest("./chrome"));
});

gulp.task('firefox-manifest', function() {
  var manifest = JSON.parse(fs.readFileSync("./src/firefox/manifest.json"));
  var permissions = manifest.permissions || {}
  var content_scripts = manifest.content_scripts || []

  permissions.push("https://" + dev_domain +":"+dev_port+"/*")
  content_scripts[1].matches.push("https://"+dev_domain+"/")
  
  return gulp.src('./src/firefox/manifest.json')
    .pipe(jeditor({
      'DEV_WARNING': 'THIS IS NOT the production package; use src/firefox/manifest.json for permanent changes'
    }))
    .pipe(jeditor({
      'permissions': permissions
    }))    
    .pipe(jeditor({
      'content_scripts': content_scripts
    }))
    .pipe(gulp.dest("./firefox"));
});


gulp.task('dev-chrome',['chrome-static','chrome-manifest','chrome-coffee'],function () {
    console.log("start watching src/chrome")
    gulp.watch('./src/chrome/manifest.json',['chrome-manifest'])
    gulp.watch(['./src/chrome/*.coffee','./src/*.coffee'],['chrome-coffee'])
})

gulp.task('dev-firefox',['firefox-xpi'],function () {
    console.log("start watching src/firefox")
    gulp.watch('./src/firefox/manifest.json',['firefox-xpi'])
    gulp.watch(['./src/firefox/*.coffee','./src/*.coffee'],['firefox-xpi'])  
})

gulp.task('dev-xpi',function (cb) {
  return gulp.src("firefox/**")
  .pipe(zip('codesy.xpi'))
  .pipe(gulp.dest('firefox'));
  cb()
})

gulp.task('firefox-xpi',function (cb) {
  runSequence('firefox-static','firefox-manifest','firefox-coffee',"dev-xpi",cb)
})

gulp.task('dev',['dev-chrome','dev-firefox'])

// create xpi for FF
gulp.task('publish-firefox', function () {
  manifest = gulp.src('./src/firefox/manifest.json')
  clean_js = combine_js("firefox")
    .pipe(stripDebug())   
    .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
    
  static_files = static_stream()
      
  merge (manifest,clean_js,static_files)
    .pipe(zip('codesy.xpi'))
    .pipe(gulp.dest('firefox')); 
});

// publish related tasks
gulp.task('publish-chrome', function () {
  manifest = gulp.src('./src/chrome/manifest.json')
  clean_js = combine_js("chrome")
    .pipe(stripDebug())   
    .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
    
  static_files = gulp.src(['static/js/*.js'], { base : "./static"})
      
  merge (manifest,clean_js,static_files)
    .pipe(zip('codesy.zip'))
    .pipe(gulp.dest('prod'));
  
});