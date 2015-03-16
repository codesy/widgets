# The codesy.io widget

The codesy.io widget is a Chrome Extension and Firefox Addon the adds codesy.io interface to open-source bugs you visit.


## To work locally

1. Clone this repo:
  * `git clone https://github.com/codesy/widgets.git`
2. Install requirements:
  * `cd widgets`
  * `npm install`
3. Run gulp to watch changes to files and compile extensions
  * `gulp dev`

## To use the Chrome Extension
1. Follow the [Unpacked Chrome Extensions
   docs](http://developer.chrome.com/extensions/getstarted.html#unpacked) and load the `chrome` directory

## To use the Firefox Add-on
1. `cd firefox`
2. Run Firefox via jpm:
  * `../node_modules/.bin/jpm run`

Note: You can [use `-p <PROFILE>` or `--profile
<PROFILE>`](https://github.com/mozilla/jpm#usage)  to use your specific
[Firefox
profile](https://support.mozilla.org/en-US/kb/profiles-where-firefox-stores-user-data).

## Publish (Chrome-only)
1. Run 'gulp publish-chrome'
  * Runs gulp coffee to compile .js files
  * Removes debug lines from .js files e.g. console.log
  * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.
2. Upload the codesy.zip file to the chrome store
