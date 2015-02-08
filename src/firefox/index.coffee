data = require("sdk/self").data
pageMod = require('sdk/page-mod')

# pageMod.PageMod {
#   include: /.*github.*/
#   contentScriptFile : [data.url('./js/jquery-2.0.3.min.js'),data.url('./js/core.content.js')]
#   }
#
pageMod.PageMod {
  include: [/.*localhost.*/,/.*codesy.*/]
  contentScriptFile : [data.url('jquery-2.0.3.min.js'),data.url('home.js')]
  }