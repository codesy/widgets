The codesy.io widget
====================
The codesy.io widget is Chrome Extension and Firefox Addon the adds codesy.io information to open-source bugs
you visit.


Set up your local environment
-----------------------------
1. Clone this repo
2. Set up Gulp

   * node install gulp
   * npm install to install dependencies


To use the 'unpacked' Chrome Extension
--------------------------------------
1. Run 'gulp dev-chrome'   
2. Follow these instructions (http://developer.chrome.com/extensions/getstarted.html#unpacked) 
3. Point to the unpacked codesy chrome extension in ./chrome.
4. Reload the extension page (chrome://extensions/)


To use the Firefox Addon
------------------------
1. Run 'gulp dev-firefox'.  This starts a watch for changes to *.coffee files and package.json

A  new directory called firefox will be created. In a new terminal window:

2. cd firefox     
3. run '../node_modules/.bin jpm run --profile your-profile'  (this runs a new instance of firefox with your default profile so your bookmarks, etc. are available)


To work on Chrome and Firefox at the same time
----------------------------------------------
1. Run 'gulp dev'  This starts a watch for changes to *.coffee files and manifest.json

2. You must manually refesh the extension page (chrome://extensions/) to see changes



When you are ready to publish (Chrome only -- FIX THIS)
-------------------------------------------------------
1. Run 'gulp publish'

   * Runs gulp coffee to compile .js files
   * Removes debug lines from .js files e.g. console.log
   * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.

2. Upload the codesy.zip file to the chrome store
