var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var stripDebug = require('gulp-strip-debug');
var merge = require('merge-stream');
var zip = require('gulp-zip');
var jeditor = require("gulp-json-editor");
var rename = require('gulp-rename')

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
        var compiled_stream = gulp.src([_this.source + '/*.coffee','./src/*.coffee'])
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
        manifest_stream = gulp.src(_this.source+'/manifest.json')
        if (_this.dev_server){
          manifest_file = JSON.parse(fs.readFileSync(_this.source + '/manifest.json')),
          permissions = manifest_file.permissions || [],
          content_scripts = manifest_file.content_scripts || [];

          permissions.push("https://" + _this.dev_server.domain +":"+_this.dev_server.port+"/")
          content_scripts[1].matches.push("https://"+_this.dev_server.domain+"/")

          var warning = ['THIS IS NOT the production manifest; use ',_this.source,'/manifest.json for permanent changes']

          manifest_stream
            .pipe(jeditor({
              'DEV_WARNING': warning.join("")
            }))
            .pipe(jeditor({
              'permissions': permissions
            }))
            .pipe(jeditor({
              'content_scripts': content_scripts
            }))

          }
          if (_this.destination){
            return manifest_stream.pipe(gulp.dest(_this.destination));
          } else {
            return manifest_stream
          }
        }
      }
    )(this)
}

settings = {
  static_files: {
    source: './static'
  },
  dev_server: {
    domain: '127.0.0.1',
    port: '8443'
  },
  firefox: {
    source: './src/firefox'
  },
  chrome: {
    source: './src/chrome',
    destination: './chrome'
  }
}

options = {
  firefox: {
    manifest: {
      source: settings.firefox.source,
      dev_server: settings.dev_server
    },
    prod: {
      source: settings.firefox.source
    }
  },
  chrome: {
    manifest: {
      source: settings.chrome.source,
      destination: settings.chrome.destination,
      dev_server: settings.dev_server
    },
    static_files: {
      source: settings.static_files.source,
      destination: settings.chrome.destination
    },
    coffee_files: {
      source: settings.chrome.source,
      destination: settings.chrome.destination + '/js'
    },
    prod: {
      source: settings.chrome.source,
      destination: "prod"
    }
  }
}


gulp.task('chrome-static', new static_files(options.chrome.static_files));
gulp.task('chrome-dev-manifest', new manifest(options.chrome.manifest));
gulp.task('chrome-coffee', new compile_coffee(options.chrome.coffee_files));

gulp.task('dev-chrome', ['chrome-static', 'chrome-dev-manifest', 'chrome-coffee'], function() {
  console.log("start watching src/chrome")
  gulp.watch(settings.chrome.source + '/manifest.json', ['chrome-dev-manifest'])
  gulp.watch([settings.chrome.source + '/*.coffee', './src/*.coffee'], ['chrome-coffee'])
})

gulp.task('dev-firefox', ['firefox-dev-xpi'], function() {
  console.log("start watching " + settings.firefox.source)
  gulp.watch(settings.firefox.source + '/manifest.json', ['firefox-dev-xpi'])
  gulp.watch([settings.firefox.source + '/*.coffee', './src/*.coffee'], ['firefox-dev-xpi'])
})


gulp.task('dev',['dev-chrome','dev-firefox'])

// foo-splaining:  gulp task functions are wrapped in '(new task_name(options))()' to immediately
// return result of function; usually this is the stream it creates


// create xpi for FF dev
gulp.task('firefox-dev-xpi', function () {
  manifest_stream =  (new manifest(options.firefox.manifest))()
  static_stream= (new static_files(settings.static_files))()
  js_stream = (new compile_coffee(settings.firefox))()
  .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
  merge (manifest_stream,js_stream,static_stream)
    .pipe(zip('codesy.xpi'))
    .pipe(gulp.dest('firefox'));
});


// create xpi for FF prod
gulp.task('publish-firefox', function () {
  manifest_stream =  (new manifest(settings.firefox))()
  static_stream= (new static_files(settings.static_files))()
  js_stream = (new compile_coffee(settings.firefox))()
    .pipe(stripDebug())
    .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
  merge (manifest_stream,js_stream,static_stream)
    .pipe(zip('codesy.xpi'))
    .pipe(gulp.dest('build'));
});

// create zip for chrome
gulp.task('publish-chrome', function () {
  manifest = (new manifest(options.chrome.prod))()
  static_stream= (new static_files(settings.static_files))()
  js_stream = (new compile_coffee(options.chrome.prod))()
    .pipe(stripDebug())
    .pipe(rename(function (path) {
      path.dirname += "/js";
    }))
  merge (manifest,js_stream,static_stream)
    .pipe(zip('codesy.zip'))
    .pipe(gulp.dest('build'));
});
