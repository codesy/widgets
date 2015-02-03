The codesy.io widget
==================================
The codesy.io widget is Chrome Extension and Firefox addon the adds codesy.io information to open-source bugs
you visit.


To use the 'unpacked' Chrome Extension
--------------------------------------
1. Clone this repo
2. Run gulp dev-start   
3. Follow these instructions (http://developer.chrome.com/extensions/getstarted.html#unpacked) the unpacked chrome extension is in ./chrome/dev.

Firefox SDK
-----------

Install firefox addon-sdk



1. Run gulp dev-start



Development
-----------
1. Clone this repo
2. Set up Gulp

   * node install gulp
   * 'npm install' to install dependencies

3. Run 'gulp dev-start' to:

   * Create a manifest.json file in the project root for loading the extension unpacked.
   * Appends development server to appropriate locations in the TEMPORARY manifest.json
     Go here to set up the development server (http://codesy.readthedocs.org/en/latest/development.html)
   * Starts watching changes to src/coffee and prod/manifest

4. Load the unpacked extension (see above)
5. Make changes the coffee script files in ./src and the ./prod/manifest.json files
6. Reload the extension page (chrome://extensions/)




When you are ready to publish
-----------------------------
1. Run 'gulp publish'

   * Runs gulp coffee to compile .js files
   * Removes debug lines from .js files e.g. console.log
   * Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.

2. Upload the codesy.zip file to the chrome store
