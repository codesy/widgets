fake_form =
  """
    <style type="text/css">
      div { border: solid red;  max-width: 70ex; }
      h4  { float: left;  margin: 0; }
    </style> 
    <form id="fake_form" action="/bids/" method="post" data-selector=".discussion-sidebar" data-container="">
      {% csrf_token %}
      <input name="url" type="hidden" value="{{ bid.url }}"></input>
      <p>
      <input name="ask" type="text" placeholder="ask" value="{{ bid.ask }}"></input>
      </p>
      <p>
      <input name="offer" type="text" placeholder="offer" value="{{ bid.offer }}"></input>
      </p>
      <input type="submit" value="Bid" />
    </form>
 """
codesy =
  options :
    endpoint: "/api"
    version: "/v1"
    domain: "127.0.0.1:8000"
    url: ->
      "https://" + @domain
  api:{}
  current:{url:null}
  
chrome.storage.local.set options:codesy.options

codesy.api.raw = (resource, ajax_params) ->
  ajax_params = ajax_params or {}
  $.ajax
    type: "get"
    url:  codesy.options.url() + resource
    data: ajax_params
    dataType: "html"

call_map = [
    ["bids","/bids"],
    ["bid","/bid/" ]
  ]
  
#build api 
for value in call_map
  do(value)->  
    codesy.api[value[0]] = (params) -> codesy.api.raw value[1], params 

codesy.isIssue = (url)->
  rx = /https:\/\/github.com\/.*\/issues\//g
  rx.test url
  
codesy.appendForm = (select,cdsyForm,containers) ->
  dfd = new $.Deferred()
  # $("body").append cdsyForm
  if $("#codesy-widget").length > 0
    dfd.resolve()
  else
    dfd.reject()
  dfd.promise()  

codesy.ask = (url) ->
  console.log "checking "+codesy.current.url
  $("body").append fake_form
  return
  codesy.api.bid({url:codesy.current.url})
    .done((data) ->
      console.log {codesy:data}
      codesy.appendForm data
    )  
    .fail((data) ->
      console.log "$.ajax failed."
      # console.log data
    )

codesy.iframe = ->
  iframe = document.createElement("iframe");
  iframe.setAttribute("src", "https://codesy.io");
  iframe.setAttribute("style", "border:none; width:150px; height:30px");
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("frameborder", "0");
  document.body.appendChild(iframe);
  
codesy.launch = ()->
  console.log codesy.current.url?="null"  +" = "+ window.location.href 
  if codesy.isIssue(window.location.href)
    console.log "an issue!"
    codesy.current.url = window.location.href    
    codesy.iframe()      
  else
    console.log "not an issue"
  # if window.location.href isnt codesy.current.url

chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "xhr received"
  if msg.action is "xhr"
    codesy.launch()
     
window.onpopstate = ->
  console.log "popstate"
  codesy.launch()

codesy.launch()

console.log "content js loaded"
