var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var stripDebug = require('gulp-strip-debug');
var mergeStream = require('merge-stream');
var mergeJSON = require('gulp-merge-json');
var zip = require('gulp-zip');
var jeditor = require("gulp-json-editor");
var rename = require('gulp-rename')

// Settings for building packages
settings = {
    name: 'codesy',
    source: './src',
    destination: './build',
    static_files: {
        source: './static',
        destination: ''
    },
    dev_server: {
        domain: '127.0.0.1',
        port: '8443'
    },
    firefox: {
        source: './src/firefox',
        destination: 'firefox',
        extension: '.xpi'
    },
    chrome: {
        source: './src/chrome',
        destination: 'chrome',
        extension: '.zip'

    }
}

// The following functions return a function to be used as a gulp task or to get
// a stream of files.  They take an options object that contains:
//    source: path of directory with files to work on
//    destination: (optional) path where files will go.  If destination is not included,
//                  the functions will return a stream of files.

compile_coffee= function(options) {
    this.source = options.source
    this.destination = options.destination
    return (
        function(_this) {
            return function() {
                console.log("compile "+_this.source + "/*.coffee files")
            // next line compile coffee files in source directory and ./src root
                var compiled_stream = gulp.src([_this.source + '/*.coffee', settings.source +'/*.coffee'])
                                            .pipe(coffee({bare: true}).on('error', gutil.log))
                if (_this.destination){
                    return compiled_stream.pipe(gulp.dest(_this.destination))
                } else {
                    return compiled_stream
                }
            }
        }
    )(this)
}

static_files = function(options) {
  this.source = options.source
  this.destination = options.destination
  return (
    function(_this) {
      return function() {
        var static_stream = gulp.src(['css/*', 'js/*.js', 'img/*.png'],
                                      { base: _this.source,
                                        cwd: _this.source
                                      })
        if (_this.destination){
          return static_stream.pipe(gulp.dest( _this.destination ))
        } else {
          return static_stream
        }
      }
    }
  )(this)
}

// this function needs to include dev server details in the options object:
//    dev_server: object with domain and port

var manifest = function (options){
  this.source = options.source
  this.destination = options.destination
  this.dev_server = options.dev_server

  return (
    function(_this) {
        return function() {
            common = gulp.src(settings.source + '/manifest.json')
            additions = gulp.src(_this.source+'/manifest_additions.json')
            manifest_stream = mergeStream(common,additions)
            .pipe(mergeJSON('manifest.json'))

            if (_this.dev_server){
                var warning = ['THIS IS NOT the production manifest; use ',_this.source,'/manifest.json for permanent changes'],
                dev_permission =["https://",_this.dev_server.domain,":",_this.dev_server.port,"/"],
                dev_match =["https://",_this.dev_server.domain,"/"]
                manifest_stream
                    .pipe(jeditor(function(json) {
                        json.DEV_WARNING=warning.join("")
                        json.permissions.push(dev_permission.join(""))
                        json.content_scripts[1].matches.push(dev_match.join(""))
                        return json
                    }))
            }
            if (_this.destination){
                return manifest_stream.pipe(gulp.dest(_this.destination));
            } else {
                return manifest_stream
            }
        }
    })(this)
}


var chrome_options = settings.static_files
chrome_options.destination = settings.chrome.destination
chrome_options.dev_server = settings.dev_server
gulp.task('chrome-static', new static_files(chrome_options));
gulp.task('chrome-dev-manifest', new manifest(settings.chrome));
gulp.task('chrome-coffee', new compile_coffee(settings.chrome));

gulp.task('dev-chrome', ['chrome-static', 'chrome-dev-manifest', 'chrome-coffee'], function() {
    console.log("start watching " + settings.chrome.source)
    var manifest_files = [settings.source + '/manifest.json',settings.chrome.source + '/manifest_additions.json']
    var coffee_files = [settings.chrome.source + '/*.coffee', settings.source + '/*.coffee']
    gulp.watch(manifest_files, ['chrome-dev-manifest'])
    gulp.watch(coffee_files, ['chrome-coffee'])
})


gulp.task('dev-firefox', ['firefox-dev-xpi'], function() {
    console.log("start watching " + settings.firefox.source)
    var manifest_files = [settings.source + '/manifest.json',settings.firefox.source + '/manifest_additions.json']
    var coffee_files = [settings.source + '/*.coffee', settings.firefox.source + '/*.coffee']
    gulp.watch(manifest_files, ['chrome-dev-manifest'])
    gulp.watch(coffee_files, ['chrome-coffee'])
})

gulp.task('dev',['dev-chrome','dev-firefox'])

// foo-splaining:  gulp task functions are wrapped in '(new task_name(options))()' to immediately
// return result of function; usually this is the stream it creates


// create xpi for FF dev
gulp.task('firefox-dev-xpi', function () {
    var firefox_options ={
        source: settings.firefox.source,
        dev_server: settings.dev_server
    }
    manifest_stream = (new manifest(firefox_options))()
    static_stream= (new static_files({source: settings.static_files.source}))()
    js_stream = (new compile_coffee(firefox_options))()
        .pipe(rename(function (path) {
            path.dirname += "/js";
        }))
    mergeStream (manifest_stream,js_stream,static_stream)
        .pipe(zip(settings.name+settings.firefox.extension))
        .pipe(gulp.dest(settings.firefox.destination));
});


// create xpi for FF prod
gulp.task('publish-firefox', function () {
    manifest_stream = (new manifest({source: settings.firefox.source}))()
    static_stream= (new static_files({source: settings.static_files.source}))()
    js_stream = (new compile_coffee({source: settings.firefox.source}))()
        .pipe(stripDebug())
        .pipe(rename(function (path) {
            path.dirname += "/js";
        }))
    mergeStream (manifest_stream,js_stream,static_stream)
        .pipe(zip(settings.name+settings.firefox.extension))
        .pipe(gulp.dest(settings.destination));
});

// create zip for chrome
gulp.task('publish-chrome', function () {
    manifest_stream = (new manifest({source: settings.chrome.source}))()
    static_stream= (new static_files({source: settings.static_files.source}))()
    js_stream = (new compile_coffee({source: settings.chrome.source}))()
        .pipe(stripDebug())
        .pipe(rename(function (path) {
            path.dirname += "/js";
        }))
    mergeStream (manifest_stream,js_stream,static_stream)
        .pipe(zip(settings.name+settings.chrome.extension))
        .pipe(gulp.dest(settings.destination));
});

gulp.task('publish-all',['publish-firefox','publish-chrome'])
