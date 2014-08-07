codesy = {}

codesy.api ={}

codesy.options =
  endpoint: "/api"
  version: "/v1"
  domain: "codesy-groovecoder.herokuapp.com"
  
chrome.storage.local.set options:codesy.options

codesy.api.raw = (resource, ajax_params) ->
    ajax_params = ajax_params or {}
    $.ajax
        type: "get"
        url: "https://" + codesy.options.domain + resource
        data: ajax_params
        dataType: "html"

call_map = [
    [
      "bid_form"
      "/bids"
    ]
  ]
  
for value in call_map
  do(value)->  
    codesy.api[value[0]] = (params) -> codesy.api.raw value[1], params 

codesy.appendForm = (select,cdsyForm,containers) ->
    dfd = new $.Deferred()
    $(select).first().append cdsyForm

    if $("#codesy-widget").length > 0
      dfd.resolve()
    else
      dfd.reject()
    dfd.promise()

codesy.href = window.location.href

codesy.ask = (url) ->
  codesy.api.bid_form(window.location.href)
    .done((data) ->
      console.log 'data received'
      # console.log data
      selector = $(data).data('selector')
      container= $(data).data('container')
      if $(selector).length > 0
          codesy.appendForm selector,data,container
    )  
    .fail((data) ->
      console.log "$.ajax failed."
      console.log data
    )
    
codesy.ask (codesy.href)

codesy.watch = ->
  if codesy.href isnt window.location.href 
    codesy.href = window.location.href
    codesy.ask(codesy.href )

window.setInterval codesy.watch,500
