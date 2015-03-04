console.time 'codesy load'

codesy =
  href : ""
  div_name : "codesy_ext"
  auth :
    domain : ""
    token : ""
  bid:{}
  events:{}

codesy.auth.set = (auth) ->
  console.log "codesy: new domain is " + auth.domain
  if auth?
    codesy.auth.token = auth.token
    codesy.auth.domain = auth.domain
  codesy.newpage()  

chrome = chrome ? false

codesy.events.submit = (e)->
  e.preventDefault()
  codesy.bid.submit $ @
    .done (data) -> 
        console.log 'codesy: bid update successful'
        codesy.newpage()
    .fail (err)->
      console.log 'codesy: bid update failed' 
      console.dir err
      console.dir codesy  
  false

codesy.append = (html)->
    $new_bid = $('<div>').attr('id',codesy.div_name).html(html)    
    $('body').append($new_bid)        
    $('form',$new_bid).submit codesy.events.submit
    $new_bid

if chrome 
  codesy.getAuth = () -> 
    chrome.storage.local.get (data)->
      codesy.auth.set data.domains[0]
    
else # firefox
  self.port.on "domain", (domain)->
    codesy.auth.set domain
    
  codesy.getAuth = () ->
    self.port.emit "getDomain"

  self.port.on "icon",(icon)->
    codesy.$icon.attr('src',icon)

  codesy.plain_append = codesy.append
  
  codesy.append = (html) ->
    $new_form = codesy.plain_append html    
    $new_form.css('z-index', 999)
    codesy.$icon = $('img',$new_form)
    self.port.emit 'getIcon'
    $new_form
          
class CodesyAjax
  constructor: ->
    @beforeSend=( ->(xhr,settings) -> xhr.setRequestHeader("Authorization","Token " + codesy.auth.token))()
    @dataType ="html"
    @
  
codesy.bid.get = (ajax_params) ->
  ajax_options = new CodesyAjax
  ajax_options.data = ajax_params or {}
  ajax_options.type = "get"
  ajax_options.url = codesy.auth.domain +  '/bid/'
  $.ajax ajax_options

codesy.bid.submit = ($form) ->
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
    
codesy.newpage = ()->
  $("#"+codesy.div_name).remove()
  if codesy.isIssue window.location.href
    console.time "codesy: request form"
    codesy.bid.get {url:window.location.href}
      .done (data) ->
        console.timeEnd "codesy: request form"
        codesy.append data
      .fail (err) ->
        console.timeEnd "codesy: request form"
        if err.status is 401
          codesy.append err.responseText
        else
          console.log err

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