codesy.io Chrome Extension
==========================

The codesy.io Chrome Extension adds codesy.io information to open-source bugs
you visit.

Getting Started with Development
--------------------------------

1. Clone this repo
+=================


2. Set up Gulp
==+===========

) node install gulp

) 'npm install' to install dependencies


3. Run 'gulp dev-start'
======================
1) Creates a manifest.json file in the project root for loading the extension unpacked.
2) Appends development server to appropriate locations in the TEMPORARY manifest.json
3) starts watching changes to src/coffee and prod/manifest


4 [Load the unpacked extension into
===================================
  Chrome](http://developer.chrome.com/extensions/getstarted.html#unpacked)
3. Fiddle with the code
4. Reload the extension page in Chrome



When you are ready to publish
=============================

Run 'gulp publish'

) runs gulp coffee to compile .js files

) removes debug lines from .js files e.g. console.log

) Creates a zip file for uploading to the chrome store.  The zip file contains the manifest.json file.

