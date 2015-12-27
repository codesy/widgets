console.time 'codesy load'

codesy =
  href : ""
  auth :
    domain : ""
    token : ""
  bid : {}
  events : {}
  rx : /https:\/\/github.com\/.*\/issues\/[1-9]+/g
  iframe :
    attr:
      id : "codesy_iframe"

codesy.auth.set = (auth) ->
  console.log "codesy: new domain is " + auth.domain
  if auth?
    codesy.auth.token = auth.token
    codesy.auth.domain = auth.domain
  codesy.newpage()  

chrome = chrome ? false

if chrome 
  codesy.getAuth = () -> 
    chrome.storage.local.get (data) ->
      codesy.auth.set data.domains[0]
    
else # firefox
  self.port.on "domain", (domain)->
    codesy.auth.set domain
    
  codesy.getAuth = () ->
    self.port.emit "getDomain"

  self.port.on "replace",(src)->
    codesy.$icon.attr('src',src)

  codesy.plain_append = codesy.append
            
class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.auth.token))()
    @dataType ="html"
    @
  
codesy.bid.url = (issue_url) ->
    codesy.auth.domain +  '/bid/?' + $.param({url:issue_url})

codesy.newpage = () ->
  $("#"+codesy.iframe.attr.id).remove()
  if codesy.rx.test window.location.href
    $("head").append('<link rel="stylesheet" type="text/css" href="'+codesy.auth.domain+'/static/css/codesy-iframe.css">')
    codesy.iframe.attr.src = codesy.bid.url window.location.href
    $('body').append $('<iframe>').attr(codesy.iframe.attr)
    console.log("codesy: iFrame added")
  else
    console.log "codesy: not an issue"

codesy.urlChange = () ->
  if codesy.href isnt window.location.href
    codesy.href = window.location.href
    codesy.getAuth()
  
  window.setTimeout codesy.urlChange, 600

codesy.urlChange()

window.onpopstate = ->
  console.log "codesy: popstate"
  codesy.getAuth()

console.timeEnd 'codesy load'