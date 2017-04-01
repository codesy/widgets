# The codesy.io widget

The codesy.io widget is an add-on for Firefox, Chrome, and Opera that adds codesy.io interface to open-source bugs you visit.


## To work locally

1. Clone this repo:
  * `git clone https://github.com/codesy/widgets.git`
2. Install requirements:
  * `cd widgets`
  * `npm install` (You can install globally with `npm install -g`)
3. Run these gulp tasks to watch changes to files and compile extensions.
  * gulp dev-chrome-unpacked - creates chrome/ directory and watches for changes
  * gulp dev-chrome-packed - creates a zip file in /chrome and watches for changes
  * gulp dev-firefox-unpacked - creates firefox/ directory and watches for changes
  * gulp dev-firefox-packed - creates an xpi in firefox/ file and watches for changes

combined tasks:
  * gulp dev-packed - creates addon packages and watches for changes
  * gulp dev-unpacked - creates directories with addon files and watches all for changes


### To use the Chrome Extension
1. Run one of the dev-chrome tasks above
2. Follow the [Unpacked Chrome Extensions
   docs](http://developer.chrome.com/extensions/getstarted.html#unpacked) and load the `chrome` directory

### To use the Firefox Add-on
1. Run one of the dev-firefox tasks above
2. Goto the the //about:addons page
3. Select 'Install Addon from File ...')
4. Load the xpi file from the firefox directory

## Publish

### Chrome and Opera
1. Run 'gulp publish-chrome'
  * Removes debug lines from .js files e.g. console.log
  * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.
2. Upload the codesy.zip file to the chrome or opera store

### Firefox
1. Run 'gulp publish-firefox'
  * Removes debug lines from .js files e.g. console.log
  * Creates an xpi file for uploading to the moz store.  The file contains the manifest.json file.
2. Upload the xpi file to the moz store
