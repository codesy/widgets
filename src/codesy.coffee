codesy =
  options :
    endpoint: "/api"
    version: "/v1"
    domain: "mysterious-badlands-8311.herokuapp.com/"
    url: ->
      "https://" + @domain
  api:{}
  current:{url:null}

chrome.storage.local.get (data)->
  codesy.options.domain = data.domain  
  
codesy.api.raw = (resource, ajax_params) ->
  ajax_params = ajax_params or {}
  $.ajax
    type: "get"
    url:  codesy.options.url() + resource
    data: ajax_params
    dataType: "html"
  
codesy.api.bid = (params) -> 
  codesy.api.raw '/bid/',params 

codesy.isIssue = (url)->
  rx = /https:\/\/github.com\/.*\/issues\/./g
  rx.test url
  
codesy.appendForm = (cdsyForm) ->
  dfd = new $.Deferred()
  $("body").append cdsyForm
  if $("#codesy-widget").length > 0
    dfd.resolve()
  else
    dfd.reject()
  dfd.promise()  
  
codesy.newpage = ()->
  $("#codesy_form").remove()
  if codesy.isIssue window.location.href
    codesy.api.bid({url:window.location.href}) 
      .done((data) ->
        console.log data
        codesy.appendForm data
      )  
      .fail((data) ->
        console.log "$.ajax failed."
      )

chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "xhr received"
  if msg.url
    codesy.newpage()
     
window.onpopstate = ->
  console.log "popstate"
  codesy.newpage()

codesy.newpage()