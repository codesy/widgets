# The codesy.io widget

The codesy.io widget is a Chrome Extension and Firefox Addon the adds codesy.io interface to open-source bugs you visit.


## To work locally

1. Clone this repo:
  * `git clone https://github.com/codesy/widgets.git`
2. Install requirements:
  * `cd widgets`
  * `npm install`
3. Run gulp to watch changes to files and compile extensions
  * 'gulp dev-chrome' - creates addon directory and watches for changes
  * 'gulp dev-firefox' - creates addon xpi file and watches for changes
  * `gulp dev` - runs 'dev-chrome' and 'dev-firefox'
  

## To use the Chrome Extension
1. Follow the [Unpacked Chrome Extensions
   docs](http://developer.chrome.com/extensions/getstarted.html#unpacked) and load the `chrome` directory

## To use the Firefox Add-on
1. `cd firefox`
2. Run 'gulp firefox-dev-xpi' (or 'gulp dev-firefox' to watch changes)
  * Goto the the //about:addons page
  * Select 'Install Addon from File ...')
  * Load the 'codesy.xpi' file from the firefox directory

## Publish

### Chrome
1. Run 'gulp publish-chrome'
  * Runs gulp coffee to compile .js files
  * Removes debug lines from .js files e.g. console.log
  * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.
2. Upload the codesy.zip file to the chrome store

### Firefox
1. Run 'gulp publish-firefox'
  * Runs gulp coffee to compile .js files
  * Removes debug lines from .js files e.g. console.log
  * Creates an xpi file for uploading to the moz store.  The file contains the manifest.json file.
2. Upload the codesy.xpi file to the moz store
