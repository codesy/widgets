codesy.io Chrome Extension
==========================

The codesy.io Chrome Extension adds codesy.io information to open-source bugs
you visit.

Getting Started with Development
--------------------------------

1. Clone this repo
2. [Load the unpacked extension into
  Chrome](http://developer.chrome.com/extensions/getstarted.html#unpacked)
3. Fiddle with the code
4. Reload the extension page in Chrome


Working with Gulp
=================

) node install gulp

) npm install to install dependencies

) gulp watch

Gulp Tasks
==========

gulp publish
------------
) runs coffee
) removes debug lines e.g. console.log
) Creates a zip file for uploading to the chrome store

gulp dev-start
-----------
1) Creates a manifest.json file in the project root for loading the extension unpacked.
2) Appends development server to appropriate locations in the TEMPORARY manifest.json

gulp dev-stop
-------------
1) Over writes the dev manifest.json for testing agains the production server

gulp watch
----------
watches coffee files for changes


Important NOTE:  prod directory contain the manifest document that will ship to the chrome store.
