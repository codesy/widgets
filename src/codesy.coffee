console.time 'codesy load'

codesy =
  url : ""
  auth_token : ""
  bid:{}
  events:{}

class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.auth_token))()
    @dataType ="html"
    @

codesy.bid.get = (ajax_params) ->
  console.log "CODESY URL: " + codesy.url
  ajax_options = new CodesyAjax
  ajax_options.data = ajax_params or {}
  ajax_options.type = "get"
  ajax_options.url = codesy.url +  'bid/'
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
  rx = /https:\/\/github.com\/.*\/issues\/[1-9]+/g
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
  
codesy.setDomain = (domain) ->
  console.log "codesy: new domain is " + domain.domain
  codesy.auth_token = domain.token
  codesy.url = domain.domain
  codesy.newpage()

codesy.newpage = ()->
  $("#codesy_bid").remove()
  if codesy.isIssue window.location.href
    console.log 'codesy: needs bid form'
    console.time "codesy: request form"
    chrome.storage.local.get (data)->
      if data.domains[0].domain isnt codesy.url
        codesy.setDomain(data.domains[0])
        codesy.bid.get {url:window.location.href}
          .done (data) ->
            console.timeEnd "codesy: request form"
            console.log "codesy: form request success"
            codesy.appendForm data
          .fail (err) ->
            console.timeEnd "codesy: request form"
            if err.status = 401
              codesy.appendForm err.responseText
            else
              console.log "codesy: form request failed"
              console.log err

codesy.newpage()


chrome.storage.onChanged.addListener (changes, namespace) ->
  console.log "codesy: token changed"
  if changes.domains.newValue[0].domain
    codesy.setDomain(changes.domains.newValue[0])

chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "codesy: xhr received"
  if msg.url
      codesy.newpage()
     
window.onpopstate = ->
  console.log "codesy: popstate"
  codesy.newpage()

console.timeEnd 'codesy load'


