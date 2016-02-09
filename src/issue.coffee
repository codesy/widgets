console.time 'codesy issue load'

codesy =
  href : ""
  home : {}
  bid : {}
  events : {}
  rx : /https:\/\/github.com\/.*\/issues\/[1-9]+/g
  iframe :
    attr:
      id : "codesy_iframe"
      style: "visibility: collapse;"

  
class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.auth.token))()
    @dataType ="html"
    @
  
codesy.bid.url = (issue_url) ->
    codesy.home.domain +  '/bid-for-url/?' + $.param({url:issue_url})

onChrome = chrome.storage ? false

if onChrome
  console.log "use chrome object" 
  codesy.getHome = () -> 
    chrome.storage.local.get null,(data) ->
      codesy.home = data.domains[0]
      codesy.newpage()  
    
else # firefox
  codesy.getHome = () ->
    # codesy.home = {domain:"https://127.0.0.1:8443"}
    if codesy.home.domain
      codesy.newpage()  
    else
      chrome.runtime.sendMessage { task : "getHome"  }

  chrome.runtime.onMessage.addListener (message) ->
      switch message.task
        when 'ackHome'
          codesy.home = message
          codesy.newpage()  

codesy.newpage = () ->
  $("#"+codesy.iframe.attr.id).remove()
  if codesy.rx.test window.location.href
    codesy.iframe.attr.src = codesy.bid.url window.location.href
    $('body').append $('<iframe>').attr(codesy.iframe.attr)
    $("head").append('<link rel="stylesheet" type="text/css" href="'+codesy.home.domain+'/static/css/codesy-iframe.css">')
    console.log("codesy newpage: iFrame added")
  else
    console.log "codesy newpage: not an issue"

codesy.urlChange = () ->
  if codesy.href isnt window.location.href
    console.log "codesy: url changed"
    codesy.href = window.location.href
    codesy.getHome()
  window.setTimeout codesy.urlChange, 600

codesy.urlChange()

window.onpopstate = ->
  console.log "codesy: popstate"
  codesy.getHome()

console.timeEnd 'codesy issue load'