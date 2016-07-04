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
var settings = {
    name: 'codesy',
    version: '0.0.0.5',
    source: './src',
    destination: './build',
    static_files: {
        source: './static',
        glob: ['css/*', 'js/*.js', 'img/*.png']
    }
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

compile_coffee = function(options) {
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
                    return compiled_stream.pipe(gulp.dest(_this.destination + '/js'))
                } else {
                    return compiled_stream
                }
            }
        }
    )(this)
}

static_files = function(destination) {
  this.destination = destination
  return (
    function(_this) {
      return function() {
        var static_stream = gulp.src(settings.static_files.glob,
                                      { base: settings.static_files.source,
                                        cwd: settings.static_files.source
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

file_name = function (ext){
    return settings.name+'-'+settings.version+ext
}
// this function needs to include dev server details in the options object:
//    dev_server: object with domain and port

var manifest = function (options,dev){
  this.options = options
  this.dev = dev
  return (
    function(_this) {
        return function() {
            var common = gulp.src(settings.source + '/manifest.json')
            var additions = gulp.src(_this.options.source+'/manifest_additions.json')
            manifest_stream = mergeStream(additions, common)
            .pipe(mergeJSON('manifest.json'))
            .pipe(jeditor(function(json) {
                json.version=settings.version
                return json
            }))
            if (_this.dev){
                var warning = ['THIS IS NOT the production manifest.'],
                dev_permission =["https://",settings.dev_server.domain,":",settings.dev_server.port,"/"],
                dev_match =["https://",settings.dev_server.domain,"/"]
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


var package = function (options, dev){
    this.options = options
    this.dev = dev
    return (
        function(_this) {
            return function() {
                var destination = _this.options.destination
                var static_stream = (new static_files())()
                var manifest_stream = (new manifest(_this.options,_this.dev))()
                var js_stream = (new compile_coffee({source:_this.options.source}))()
                    .pipe(rename(function (path) {
                        path.dirname += "/js";
                    }))

                if (_this.dev){
                    package_name = settings.name+'.dev'+_this.options.extension
                } else {
                    js_stream = js_stream.pipe(stripDebug())
                    package_name = file_name(_this.options.extension)
                    destination = settings.destination
                }


                mergeStream (manifest_stream,js_stream,static_stream)
                    .pipe(zip(package_name))
                    .pipe(gulp.dest(destination));
            }
        }
    )(this)
}

var watch = function (options) {
    this.options = options
    return (
        function (_this) {
            return function () {
                var manifest_files = [settings.source + '/manifest.json',_this.options.source + '/manifest_additions.json']
                var coffee_files = [_this.options.source + '/*.coffee', settings.source + '/*.coffee']
                // watch static files
                gulp.watch(gulp.src(settings.static_files.glob,{ base: settings.static_files.source })
                // watch manifest files
                gulp.watch(manifest_files, ['chrome-dev-manifest'])
                gulp.watch(coffee_files, ['chrome-coffee'])

            }
        }
    )(this)
}

// DEV TASKS
var chrome_options = settings.chrome
chrome_options.dev_server = settings.dev_server
gulp.task('chrome-static', new static_files(settings.chrome.destination));
gulp.task('chrome-dev-manifest', new manifest(settings.chrome,true));
gulp.task('chrome-coffee', new compile_coffee(settings.chrome));

gulp.task('dev-chrome-unpacked', ['chrome-static', 'chrome-dev-manifest', 'chrome-coffee'], function() {
    console.log("start watching chrome files")
    var start_watching = (watch)(settings.chrome)
})

gulp.task('dev-chrome-packed', ['chrome-dev-zip'], function() {
    console.log("start watching " + settings.chrome.source)
    var manifest_files = [settings.source + '/manifest.json',settings.chrome.source + '/manifest_additions.json']
    var coffee_files = [settings.source + '/*.coffee', settings.chrome.source + '/*.coffee']
    gulp.watch(manifest_files, ['chrome-dev-manifest'])
    gulp.watch(coffee_files, ['chrome-coffee'])
})

var firefox_options = settings.firefox
firefox_options.dev_server = settings.dev_server
gulp.task('firefox-static', new static_files(settings.firefox.destination));
gulp.task('firefox-dev-manifest', new manifest(firefox_options));
gulp.task('firefox-coffee', new compile_coffee(firefox_options));

gulp.task('dev-firefox-unpacked', ['firefox-static', 'firefox-dev-manifest', 'firefox-coffee'], function() {
    console.log("start watching " + settings.firefox.source)
    var manifest_files = [settings.source + '/manifest.json',settings.firefox.source + '/manifest_additions.json']
    var coffee_files = [settings.firefox.source + '/*.coffee', settings.source + '/*.coffee']
    gulp.watch(manifest_files, ['firefox-dev-manifest'])
    gulp.watch(coffee_files, ['firefox-coffee'])
})

gulp.task('dev-firefox-packed', ['firefox-dev-xpi'], function() {
    console.log("start watching " + settings.firefox.source)
    var manifest_files = [settings.source + '/manifest.json',settings.firefox.source + '/manifest_additions.json']
    var coffee_files = [settings.source + '/*.coffee', settings.firefox.source + '/*.coffee']
    gulp.watch(manifest_files, ['chrome-dev-manifest'])
    gulp.watch(coffee_files, ['chrome-coffee'])
})

gulp.task('dev-unpacked',['dev-chrome-unpacked','dev-firefox-unpacked'])
gulp.task('dev-packed',['dev-chrome-packed','dev-firefox-packed'])



// FILE BUILDING TASKS
// foo-splaining:  gulp task functions are wrapped in '(new task_name(options))()' to immediately
// return result of function; usually this is the stream it creates


// create xpi for FF dev in the firefox.source directory with dev settings
gulp.task('firefox-dev-xpi', (new package(settings.firefox,true)()));

// create zip for chrome dev in the chrome.source directory with dev settings
gulp.task('chrome-dev-zip', new package(settings.chrome,true))

// create xpi for FF prod
gulp.task('publish-firefox', new package(settings.firefox,false))

// create zip for chrome
gulp.task('publish-chrome', new package(settings.chrome,false))

gulp.task('publish-all',['publish-firefox','publish-chrome'])
