watch = (details)->
  chrome.tabs.getSelected null, (tabs)->
    console.log "xhr sent to: "+tabs.url + ":" +tabs.id
    chrome.tabs.sendMessage tabs.id, {action:"xhr"}
  
filter =
   url: [{originAndPathMatches:".*/github.com/.*/.*/issues/*"}]
     
chrome.webNavigation.onHistoryStateUpdated.addListener watch, filter

# console.log "I'm in the background"
# msg =-> console.log "I'm still in the background"
# setInterval(msg,5000)