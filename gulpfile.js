var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps');
var stripDebug = require('gulp-strip-debug');
var merge = require('merge-stream');
var zip = require('gulp-zip');
var jeditor = require("gulp-json-editor");
var shell = require('gulp-shell');
var rename = require('gulp-rename')

dev_domains = ["127.0.0.1", "*.herokuapp.com"]
dev_port = '8443'


compile_chrome = function (event) {
  return gulp.src(['./src/chrome/*.coffee','./src/*.coffee'])
    .pipe(coffee({bare: true}).on('error', gutil.log))
};

gulp.task('chrome-coffee', function(event) {
    compile_chrome().pipe(gulp.dest('./chrome/js'))
});


gulp.task('firefox-coffee', function(event) {
  return gulp.src(['./src/firefox/*.coffee','./src/*.coffee'])
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./firefox/data/js'))
});

gulp.task('load-static',function () {
  static_files = gulp.src (['css/*','js/*.js','img/*.png'],{ base: "./static", cwd : "./static"})
  static_files.pipe(gulp.dest('chrome'))
  static_files.pipe(gulp.dest('firefox/data'))  
})


gulp.task('chrome-manifest', function() {
  
  manifest = require('./src/chrome/manifest.json')
  permissions = manifest.permissions || []
  content_scripts = manifest.content_scripts || []

  dev_domains.forEach(function(dev_domain){
    permissions.push("https://" + dev_domain +":"+dev_port+"/")
    content_scripts[1].matches.push("*://"+dev_domain+":*/")
  });
  
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

gulp.task('firefox-package', function() {
  
  packagejson = require('./src/firefox/package.json')
  permissions = packagejson.permissions || {}
  dev_domains.forEach(function(dev_domain){
    permissions['cross-domain-content'].push("https://" + dev_domain +":"+dev_port+"/")
  });

  gulp.src('./src/firefox/package.json')
    .pipe(jeditor({
      'DEV_WARNING': 'THIS IS NOT the production package; use src/firefox/package.json for permanent changes'
    }))
    .pipe(jeditor({
      'permissions': permissions
    }))    
    .pipe(gulp.dest("./firefox"));

});


gulp.task('dev-chrome',['load-static','chrome-manifest','chrome-coffee'],function () {
    gulp.watch('./src/chrome/manifest.json',['chrome-manifest'])  
    gulp.watch(['./src/chrome/*.coffee','./src/*.coffee'],['chrome-coffee'])
})

gulp.task('dev-firefox',['load-static','firefox-package','firefox-coffee'],function () {
    gulp.watch('./src/firefox/package.json',['firefox-package'])
    gulp.watch(['./src/firefox/*.coffee','./src/*.coffee'],['firefox-coffee'])  

})

gulp.task('dev',['dev-chrome','dev-firefox'])


// publish related tasks
gulp.task('publish-chrome', function () {
  manifest = gulp.src('./src/chrome/manifest.json')
  clean_js = compile_chrome()
    .pipe(stripDebug())   
    .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
  static_files = gulp.src(['static/js/*.js'], { base : "./static"})
      
  merge (manifest,clean_js,static_files)
    .pipe(zip('codesy.zip'))
    .pipe(gulp.dest('prod'));
  
});
