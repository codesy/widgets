console.time 'codesy load'

codesy =
  options :
    form:
      heigth: 100
      width: 100
    url: "https://" + chrome.runtime.getManifest().bid_domain
  form: null
  bid:{}
  current:{url:null}

codesy.auth_token = ->
  if codesy.options.auth_token
    codesy.options.auth_token
  else
    # chrome.tabs.create({url: "options.html"});

codesy.bid.get = (ajax_params) ->
  console.log 'codesy: '+ codesy.options.auth_token
  ajax_params = ajax_params or {}
  $.ajax
    beforeSend: (xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.options.auth_token)
    type: "get"
    url:  codesy.options.url +  '/bid/'
    data: ajax_params
    dataType: "html"

codesy.bid.update = (form) ->
  form = form or {}
  $.ajax
    beforeSend: (xhr,settings) -> xhr.setRequestHeader("Authorization","Token " +codesy.options.auth_token)
    type: form.attr('method')
    url: form.attr('action')
    data: form.serialize()
    dataType: "html"
    success: (data) ->
      codesy.newpage()
    error: (err)->
      console.log 'codesy: bid update failed' 
      console.log err

codesy.isIssue = (url)->
  console.log 'codesy isIssue : '+ url
  rx = /https:\/\/github.com\/.*\/issues\/./g
  rx.test url
  
codesy.appendForm = (form_html) ->
  dfd = new $.Deferred()
  $("body").append form_html
  if $("#codesy_bid_form").length > 0

    # add the form and position it
    codesy.form = $("#codesy_bid_form")

    # wait for submit
    codesy.form.submit (e)->
      e.preventDefault()
      codesy.bid.update(codesy.form)
      false

    dfd.resolve()
  else
    dfd.reject()

  dfd.promise()
  
codesy.newpage = ()->
  $("#codesy_bid_form").remove()
  if codesy.isIssue window.location.href
    console.log 'codesy: needs bid form'
    console.time "codesy: request form"
    codesy.bid.get {url:window.location.href}
      .done (data) ->
        console.timeEnd "codesy: request form"
        codesy.appendForm data
        # console.log data
      .fail (data) ->
        console.timeEnd "codesy: request form"
        console.log "codesy: $.ajax failed."
        console.log data

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


