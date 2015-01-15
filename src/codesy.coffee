console.time 'codesy load'

codesy =
  options :
    url: "https://" + chrome.runtime.getManifest().bid_domain
  bid:{}
  events:{}

class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.options.auth_token))()
    @dataType ="html"
    @

codesy.auth_token = ->
  if codesy.options.auth_token
    codesy.options.auth_token
  else
    # chrome.tabs.create({url: "options.html"});

codesy.bid.get = (ajax_params) ->
  ajax_options = new CodesyAjax
  ajax_options.data = ajax_params or {}
  ajax_options.type = "get"
  ajax_options.url = codesy.options.url +  '/bid/'
  $.ajax ajax_options

codesy.bid.update = ($form) ->
  $form = $form or []
  ajax_options = new CodesyAjax
  ajax_options.data = $form.serialize()
  ajax_options.type = $form.attr('method')
  ajax_options.url = $form.attr('action')
  $.ajax ajax_options

codesy.isIssue = (url)->
  console.log 'codesy isIssue : '+ url
  rx = /https:\/\/github.com\/.*\/issues\/./g
  rx.test url
  
codesy.events.submit = (e)->
  e.preventDefault()
  codesy.bid.update $ @
    .done (data) -> 
        console.log 'codesy: bid update successful'
        codesy.newpage()
    .fail (err)->
      console.log 'codesy: bid update failed' 
      console.log err  
  false

codesy.appendForm = (form_html) ->
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
        codesy.appendForm data
        # console.log data
      .fail (err) ->
        console.timeEnd "codesy: request form"
        if err.status = 401
          codesy.appendForm err.responseText

chrome.storage.local.get (data)->
  codesy.options.auth_token = data.auth_token 
  codesy.newpage()

chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "codesy: xhr received"
  if msg.url
    codesy.newpage()
     
window.onpopstate = ->
  console.log "codesy: popstate"
  codesy.newpage()

console.timeEnd 'codesy load'


