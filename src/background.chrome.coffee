watch = (details)->
  chrome.tabs.getSelected null, (tabs)->
    console.log "xhr sent: " + tabs.url
    chrome.tabs.sendMessage tabs.id, {url:tabs.url}  

filter =
   url: [{originAndPathMatches:".*/github.com/.*/.*"}]

chrome.webNavigation.onHistoryStateUpdated.addListener watch, filter