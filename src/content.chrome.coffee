console.time 'codesy load'

codesy =
  auth :
    domain : ""
    token : ""
  bid:{}
  events:{}

class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.auth.token))()
    @dataType ="html"
    @
  
codesy.bid.get = (ajax_params) ->
  ajax_options = new CodesyAjax
  ajax_options.data = ajax_params or {}
  ajax_options.type = "get"
  ajax_options.url = codesy.auth.domain +  'bid/'
  $.ajax ajax_options

codesy.bid.update = ($form) ->
  $form = $form or []
  ajax_options = new CodesyAjax
  ajax_options.data = $form.serialize()
  ajax_options.type = $form.attr('method')
  ajax_options.url = $form.attr('action')
  $.ajax ajax_options

codesy.isIssue = (href)->
  console.log 'codesy isIssue : '+ href
  rx = /https:\/\/github.com\/.*\/issues\/[1-9]+/g
  rx.test href
  
codesy.events.submit = (e)->
  e.preventDefault()
  codesy.bid.update $ @
    .done (data) -> 
        console.log 'codesy: bid update successful'
        codesy.newpage()
    .fail (err)->
      console.log 'codesy: bid update failed' 
      console.dir err
      console.dir codesy  
  false

codesy.append = (form_html) ->
  $("body").append form_html
  if $("#codesy_bid_form").length > 0
    $("#codesy_bid_form").submit codesy.events.submit
  
codesy.newpage = ()->
  $("#codesy_bid").remove()
  if codesy.isIssue window.location.href
    console.log 'codesy: needs bid form'
    console.time "codesy: request form"
    codesy.bid.get {url:window.location.href}
      .done (data) ->
        console.timeEnd "codesy: request form"
        console.log "codesy: form request success"
        codesy.append data
      .fail (err) ->
        console.timeEnd "codesy: request form"
        console.log "codesy: form request failed"
        if err.status is 401
          codesy.append err.responseText
        else
          console.log err

codesy.auth.set = (auth) ->
  console.log "codesy: new domain is " + auth.domain
  codesy.auth.token = auth.token
  codesy.auth.domain = auth.domain
  codesy.newpage()

chrome.storage.local.get (data)->
  codesy.auth.set(data.domains[0])

chrome.storage.onChanged.addListener (changes, namespace) ->
  console.log "codesy: token changed"
  if changes.domains.newValue[0].domain
    codesy.auth.set(changes.domains.newValue[0])
    
      
chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "codesy: xhr received"
  if msg.url
    codesy.newpage()
     
window.onpopstate = ->
  console.log "codesy: popstate"
  codesy.newpage()

console.timeEnd 'codesy load'


