watch = (details)->
  chrome.tabs.getSelected null, (tabs)->
    console.log "xhr sent: " + tabs.url
    chrome.tabs.sendMessage tabs.id, {url:tabs.url}  

filter =
   url: [{originAndPathMatches:".*/github.com/.*/.*"}]




chrome.runtime.onMessage.addListener (message, sender, sendResponse)-> alert "codesy msg received"
