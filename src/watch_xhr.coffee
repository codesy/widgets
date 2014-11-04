watch = (details)->
  console.log "xhr sent"
  chrome.tabs.getSelected null, (tabs)->
    chrome.tabs.sendMessage tabs.id, {action:"xhr"}
  
filter =
   url: [{originAndPathMatches:".*/github.com/.*/.*/issues/.*"}]
     
chrome.webNavigation.onHistoryStateUpdated.addListener watch, filter
