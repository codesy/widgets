The codesy.io widget
====================
The codesy.io widget is Chrome Extension and Firefox Addon the adds codesy.io information to open-source bugs
you visit.


Development
-----------
1. Clone this repo
2. Set up Gulp
   * node install gulp
   * 'npm install' to install dependencies
3. For firefox run 'npm install jpm'


To use the 'unpacked' Chrome Extension
--------------------------------------
1. Run 'gulp dev-chrome'   
2. Follow these instructions (http://developer.chrome.com/extensions/getstarted.html#unpacked) 
3. Point to the unpacked codesy chrome extension in ./chrome.
4. Reload the extension page (chrome://extensions/)


To use the Firefox Addon
------------------------
1. Run 'gulp dev-firefox'   
2. Run 'jpm run --profile default'  (this runs a new instance of firefox with your default profile so your bookmarks, etc. are available)


To work on Chrome and Firefox at the same time
----------------------------------------------
1. Run 'gulp dev'



When you are ready to publish (Chrome only -- FIX THIS)
-------------------------------------------------------
1. Run 'gulp publish'

   * Runs gulp coffee to compile .js files
   * Removes debug lines from .js files e.g. console.log
   * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.

2. Upload the codesy.zip file to the chrome store
