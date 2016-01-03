data    = require("sdk/self").data
pageMod = require('sdk/page-mod')
ss      = require("sdk/simple-storage")
note    = require("sdk/notifications").notify

{Cc, Ci, Cu} = require("chrome");
{WebRequest} = Cu.import("resource://gre/modules/WebRequest.jsm", {});
Cu.import("resource://gre/modules/MatchPattern.jsm");
  
notify = (msg) ->
  note {
    title: "codesy"
    text: msg
  }

auths =
  onAdd : []
  find : (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)
  add : (auth)->
    domains = ss.storage.domains ? []
    idx = auths.find(domains,auth.domain)
    domains.splice(idx, 1) if idx isnt -1
    domains.unshift(auth)
    ss.storage.domains = domains
    for  callback in auths.onAdd
      do (auth)->
        callback auth      
  get : ->
    domains = ss.storage.domains ? []
    domains[0] ?= {}


isCSPHeader = (headerName) ->
  (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')

# isXframeHeader = (headerName) ->
#   (headerName is 'X-FRAME-OPTIONS')
 

pattern = new MatchPattern("https://github.com/*");

headerFilter =
    {
      urls: pattern
    }

cspAppend = (domain) ->
    @domain = domain
    (details) => 
      for header in details.responseHeaders
          name = header.name.toUpperCase()
          if isCSPHeader name
            header.value = header.value.replace('connect-src', 'connect-src '+ @domain) # required for FF not Chrome
            header.value = header.value.replace('script-src', 'script-src '+ @domain)
            header.value = header.value.replace('style-src', 'style-src '+ @domain)
            header.value = header.value.replace('frame-src', 'frame-src '+ @domain)
          
          # if isXframeHeader name
          #   header.value = "ALLOW-FROM " + @domain
      
      # console.log details.responseHeaders
      {responseHeaders: details.responseHeaders}

addCodesy = new cspAppend ( 'https://127.0.0.1:8443')
 
# Listens for github CSP
notify "adding WebRequest listener"
WebRequest.onHeadersReceived.addListener addCodesy, headerFilter, ["responseHeaders","blocking"]

# github issue pages
pageMod.PageMod {
  include: /.*github.*/
  contentScriptWhen : "end"
  contentStyleFile : [
    './css/styles.css'
    './css/pure-min.css'
  ]
  contentScriptFile : [
    data.url('js/jquery-2.0.3.min.js')
    data.url('js/issue.js')
  ]
  onAttach: (worker)->
    emitDomain = (domain) ->
      worker.port.emit "domain", domain
    
    auths.onAdd.push emitDomain
    
    # event from issue asking for domain
    worker.port.on "getDomain", ->      
      emitDomain auths.get()

    # worker.port.on "getLocal",(file)->
    #   worker.port.emit "replace", data.url('./img/'+file)
}

# codesy home page
pageMod.PageMod {
  include : [
    /.*127.0.0.1:8443\//
    /.*codesy.io\//
  ]
  contentScriptFile : [
    data.url('./js/jquery-2.0.3.min.js')
    data.url('./js/home.js')
  ]
  onAttach: (worker) ->
    worker.port.on "newDomain", (domain)->
      auths.add domain
      worker.port.emit "domain", auths.get()
  
  }
