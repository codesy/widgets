saveOptions = ->
  domain = $("#domain_list").val()
  chrome.storage.local.set domain: domain
  chrome.storage.local.get (options)->
    codesy.options=options
    
  status = document.getElementById("status")
  status.innerHTML = "Saved."
  setTimeout (->
    status.innerHTML = ""
  ), 750
  return

loadOptions = ->
  $.each domains, (i, v) ->
    $("#domain_list").append $("<option>").attr("value", v).text(v)    
  chrome.storage.local.get (options) ->
    domain = options.domain
    domain = "api.codesy.io"  unless domain
    $("#domain_list").val domain
    
domains = [
  "api.codesy.io"
  "codesy-stage.herokuapp.com"
  "codesy-dev.herokuapp.com"
  "codesy-jdungan.herokuapp.com"
  "codesy-groovecoder.herokuapp.com"
]

document.addEventListener "DOMContentLoaded", loadOptions
document.querySelector("button#save").addEventListener "click", saveOptions