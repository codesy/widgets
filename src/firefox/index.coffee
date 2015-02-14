data    = require("sdk/self").data
pageMod = require('sdk/page-mod')
ss      = require("sdk/simple-storage")

note = require("sdk/notifications").notify

notify = (msg) ->
  note {
    title: "codesy"
    text: msg
  }

auths =
  find : (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)
  add : (auth)->
    domains = ss.storage.domains ? []
    idx = auths.find(domains,auth.domain)
    # notify "token: " + auth.token
    domains.splice(idx, 1) if idx isnt -1
    domains.unshift(auth)
    ss.storage.domains = domains
  get : ->
    domains = ss.storage.domains ? []
    domains[0] ?= {}

# github issues
pageMod.PageMod {
  include: /.*github.*/
  contentScriptWhen: "end"
  contentStyleFile:[
    './css/styles.css'
    './css/pure-min.css'
  ]
  contentScriptFile : [
    data.url('./js/jquery-2.0.3.min.js')
    data.url('./js/issue.js')
  ]
  onAttach: (worker)->
    notify "attached"
    worker.port.on "getDomain", ->      
      notify "get auth: "+ auths.get().token
      worker.port.emit "domain", auths.get()

}

# codesy home page
pageMod.PageMod {
  include: [/.*localhost.*/,/.*codesy.io.*/]
  contentScriptFile : [
    data.url('./js/jquery-2.0.3.min.js')
    data.url('./js/home.js')
  ]
  onAttach: (worker) ->
    worker.port.on "newDomain", (domain)->
      auths.add domain
      # notify "new auth: "+domain.token
      worker.port.emit "domain", domain
  }