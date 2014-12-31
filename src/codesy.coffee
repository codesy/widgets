console.time 'load'

codesy =
  options :
    form:
      heigth: 100
      width: 100
    url: "https://mysterious-badlands-8311.herokuapp.com"
  form: null
  bid:{}
  current:{url:null}

chrome.storage.local.get (data)->
  codesy.options.auth_token = data.auth_token 
 
codesy.bid.get = (ajax_params) ->
  ajax_params = ajax_params or {}
  $.ajax
    beforeSend: (xhr,settings) ->
      xhr.setRequestHeader("Authorization","Token "+codesy.auth_token())
    type: "get"
    url:  codesy.options.url +  '/bid/'
    data: ajax_params
    dataType: "html"

codesy.openOptions = ->
  chrome.runtime.sendMessage "openOptions"

codesy.auth_token = ->
  if codesy.options.auth_token
    codesy.options.auth_token
  else
    # chrome.tabs.create({url: "options.html"});

codesy.bid.update = (form) ->
  $.ajax
    beforeSend: (xhr,settings) ->
      xhr.setRequestHeader("Authorization","Token "+codesy.auth_token())
    type: form.attr('method')
    url: form.attr('action')
    data: form.serialize()
    dataType: "html"
    success:  ->
      codesy.newpage()
    error: (err)->
      console.log err

codesy.isIssue = (url)->
  rx = /https:\/\/github.com\/.*\/issues\/./g
  rx.test url
  
codesy.positionForm = () ->
  footerTop = $(window).scrollTop()+$(window).height()-codesy.options.form.heigth
  footerLeft = $(window).width()-codesy.options.form.width
  if ($(document.body).height()+footerTop) > $(window).height() 
     codesy.form.css {position: "absolute", top: footerTop,left:footerLeft}
  else
     codesy.form.css {position: "static", top: footerTop,left:footerLeft}

codesy.appendForm = (form_html) ->
  dfd = new $.Deferred()
  $("body").append form_html
  if $("#codesy_bid_form").length > 0

    # add the form and position it
    codesy.form = $("#codesy_bid_form")
    codesy.positionForm()

    # wait for submit
    codesy.form.submit (e)->
      e.preventDefault()
      codesy.bid.update(codesy.form)
      false

    #listen for changes
    $(window)
      .scroll(codesy.positionForm)
      .resize(codesy.positionForm)    
    dfd.resolve()
  else
    dfd.reject()

  dfd.promise()
  
codesy.newpage = ()->
  $("#codesy_bid_form").remove()
  if codesy.isIssue window.location.href
    codesy.bid.get {url:window.location.href}
      .done (data) ->
        codesy.appendForm data
        console.log data
      .fail (data) ->
        console.log "$.ajax failed."

chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "xhr received"
  if msg.url
    codesy.newpage()

     
window.onpopstate = ->
  console.log "popstate"
  codesy.newpage()

codesy.newpage()

console.timeEnd 'load'


