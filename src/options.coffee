

loadOptions = ->
  chrome.storage.local.get (options) ->
   $("#auth_token").val(options.auth_token)
    
document.addEventListener "DOMContentLoaded", loadOptions

saveOptions = ->
  auth_token =  $("#auth_token").val()
  chrome.storage.local.set auth_token: auth_token
  codesy.options.auth_token = auth_token
  status = document.getElementById("status")
  status.innerHTML = "Saving ..."
  setTimeout( (-> status.innerHTML = ""), 750)

document.querySelector("button#save").addEventListener "click", saveOptions