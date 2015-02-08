chrome.storage.onChanged.addListener (changes, namespace) ->
  console.log "codesy: token changed"
  if changes.domains.newValue[0].domain
    codesy.auth.set changes.domains.newValue[0]

  
chrome.runtime.onMessage.addListener (msg, sender, sendResponse)->
  console.log "codesy: xhr received"
  if msg.url
    codesy.newpage()
