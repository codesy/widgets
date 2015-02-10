data    = require("sdk/self").data
pageMod = require('sdk/page-mod')
ss      = require("sdk/simple-storage")

note = require("sdk/notifications").notify

notify = (msg,dat) ->
  note {
    title: "codesy"
    text: msg
    onClick: () -> 
      console.dir dat
  }

auths =
  find : (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)
  add : (auth)->
    domains = ss.storage.domains ? []
    idx = auths.find(domains,auth.domain)
    notify "idx: " + idx
    domains.splice(idx, 1) if idx isnt -1
    domains.unshift(auth)
    ss.storage.domains = domains
  get: ->
    domains = ss.storage.domains ? []
    notify "auths get "+domains,domains
    domains[0]

# github issues
pageMod.PageMod {
  include: /.*github.*/
  contentScriptFile : [
    data.url('./js/jquery-2.0.3.min.js')
    data.url('./js/issue.js')
  ]
  onAttach: (worker)->
    worker.port.on "getDomain", ->      
      worker.port.emit "domain", auths.get()
  }

# codesy home page
pageMod.PageMod {
  include: [/.*localhost.*/,/.*codesy.*/]
  contentScriptFile : [
    data.url('./js/jquery-2.0.3.min.js')
    data.url('./js/home.js')
  ]
  onAttach: (worker) ->
    worker.port.on "newDomain", (domain)->
      auths.add domain
      worker.port.emit "domain", domain
  }