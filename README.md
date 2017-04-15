# The codesy.io widget

The codesy.io widget is an add-on for Firefox, Chrome, and Opera that adds codesy.io interface to open-source bugs you visit.


## To work locally

1. Clone this repo:
  * `git clone https://github.com/codesy/widgets.git`
2. Install requirements:
  * `cd widgets`
  * `npm install` (You can install globally with `npm install -g`)
3. See the list of gulp tasks build or watch changes to files and compile extensions:


### To use the Chrome Extension
1. Run `workon-chrome-directory`
2. Follow the [Unpacked Chrome Extensions
   docs](http://developer.chrome.com/extensions/getstarted.html#unpacked) and load the `chrome` directory

### To use the Firefox Add-on
1. Run `gulp workon-firefox-file`
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


## Gulp Tasks

#### build-{browser}-file:
* **build-firefox-file**: create xpi for FF dev in the firefox.source directory with dev settings
* **build-chrome-file**: create zip for chrome dev in the chrome.source directory with dev settings

#### build-{browser}-directory:
* **build-firefox-directory**: create firefox dev directroy in the firefox.source directory with dev settings
* **build-chrome-directory**: create chrome dev directroy in the chrome.source directory with dev settings

#### workon-{browser}-directory or workon-{browser}-directory:
watches extension files and rebuilds
* **workon-firefox-file**
* **workon-firefox-directory**
* **workon-chrome-file**
* **workon-chrome-directory**

#### publish-{browser}-file
* **publish-firefox-file**: create xpi for FF prod
* **publish-chrome-file**: create zip for chrome and opera
* **publish-all**: creates all browser extension files
