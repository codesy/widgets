const fs = require('fs');
const gulp = require('gulp');
const stripDebug = require('gulp-strip-debug');
const mergeStream = require('merge-stream');
const mergeJSON = require('gulp-merge-json');
const zip = require('gulp-zip');
const jeditor = require("gulp-json-editor");
const rename = require('gulp-rename')
const headerComment = require('gulp-header-comment');

// Settings for building packages
const settings = {
    name: 'codesy',
    version: '0.0.0.6',
    source: './src',
    destination: './dist',
    static_files: {
        source: './static',
        glob: ['css/*', 'js/*.js', 'img/*.png']
    },
    dev_server: {
        domain: '127.0.0.1',
        port: '8443'
    },
    firefox: {
        source: './src/firefox',
        destination: 'firefox',
        extension: 'xpi'
    },
    chrome: {
        source: './src/chrome',
        destination: 'chrome',
        extension: 'zip'

    }
}

// The following functions return a function to be used as a gulp task or to get
// a stream of files.  They take an options object that contains:
//    source: path of directory with files to work on
//    destination: (optional) path where files will go.  If destination is not included,
//                  the functions will return a stream of files.

javascript_src = function({source, destination}) {
    return function() {
        console.log(`gather src ${source}/*.js files`)
        console.log(`gather src ${settings.source}/*.js files`)

        const js_files = gulp.src([`${source}/*.js`, `${settings.source}/*.js`])
            .pipe(headerComment(`codesy widget version ${settings.version}`))

        if (destination){
            console.log(` destination ${destination}/js`);
            return js_files.pipe(gulp.dest(`${destination}/js`))
        } else {
            return js_files
        }
    }
}

static_files = ({glob, source}) => gulp.src(glob, { base: source, cwd: source });

// this function needs to include dev server details in the options object:
//    dev_server: object with domain and port

const manifest = function ({source, destination}){
    return function() {
        const common = gulp.src(`${settings.source}/manifest.json`)
        const additions = gulp.src(`${source}/manifest_additions.json`)
        manifest_stream = mergeStream(additions, common)
            .pipe(mergeJSON('manifest.json'))
            .pipe(jeditor(function(json) {
                json.version=settings.version
                return json
            }))
        if (destination){
            return manifest_stream.pipe(gulp.dest(destination));
        } else {
            return manifest_stream
        }
    }
}

const add_dev_server = function (manifest_stream) {
    ({domain, port} = settings.dev_server)
    const warning = 'THIS IS NOT the production manifest.',
    dev_permission =`https://${domain}:${port}/`,
    dev_match =`https://${domain}/`
    return manifest_stream
        .pipe(jeditor(function(json) {
            json.DEV_WARNING=warning
            json.permissions.push(dev_permission)
            json.content_scripts[1].matches.push(dev_match)
            return json
        }))
}

const package = function ({source, destination: dest, extension: ext}, zipped, for_dev){
    return function() {
        console.log(`package source: ${source}`);
        const package_name = `${settings.name}-${settings.version}${for_dev?'.dev':''}.${ext}`
        const destination = for_dev ? dest : settings.destination
        console.log(`package dest: ${destination}`);

        let static_stream = static_files(settings.static_files)
        let manifest_stream = (new manifest({source}))()
        const js_stream = (new javascript_src( {source} ))()
            .pipe(rename( (path)=>path.dirname += "/js" ))

        if (for_dev){
            manifest_stream = add_dev_server (manifest_stream)
        } else {
            js_stream.pipe(stripDebug())
        }

        const package_stream = mergeStream (manifest_stream,js_stream,static_stream)

        if (zipped) {
            package_stream
                .pipe(zip(package_name))
                .pipe(gulp.dest(destination))
        } else {
            package_stream
                .pipe(gulp.dest(destination));
        }
    }
}

const watch_src = function ({source}, task) {
    console.log("start watching");
    const manifest_files = [`${settings.source}/manifest.json`,`${source}/manifest_additions.json`]
    const js_files = [`${source}/*.js`, `${settings.source}/*.js`]
    gulp.watch(`${settings.static_files.source}/**`, task)
    gulp.watch(manifest_files, task)
    gulp.watch(js_files, task)
}

const browsers = ['firefox', 'chrome']

for (browser of browsers){
    const build_file_task = `build-${browser}-file`
    const build_directory_task = `build-${browser}-directory`
    const options = settings[browser]

    // ADDON BUILDING TASKS
    gulp.task(build_file_task, (new package(options, true, true)))
    gulp.task(build_directory_task, (new package(options, false, true)))
    gulp.task(`publish-${browser}-file`, (new package(options, true, false)))

    // WATCH TASKS
    gulp.task(`workon-${browser}-directory`, [build_directory_task],
        () => watch_src(options, [build_directory_task])
    );
    gulp.task(`workon-${browser}-file`, [build_file_task],
        () => watch_src(options, [build_file_task])
    );
}

const publish_tasks = browsers.map((b)=>`publish-${b}-file`)
gulp.task('publish-all',publish_tasks)

// FF dev must use file
gulp.task('workon-mixed',['workon-chrome-directory','workon-firefox-file'])
