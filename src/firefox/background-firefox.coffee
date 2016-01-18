debugger;

notify = (msg) ->
  chrome.notifications.create ({
    title: "codesy"
    message: msg
  })

codesy =
  find : (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)
  add : (home)->
    chrome.storage.local.get "domains", (data) ->
      console.log "codesy: local data"
      domains = data.domains or []
      idx = codesy.find(domains,home.domain)
      domains.splice(idx, 1) if idx isnt -1
      domains.unshift(home)
      chrome.storage.local.set({'domains':domains});
  get : (sender) ->
    chrome.storage.local.get "domains", (data) ->
      console.log "codesy: get data"
      domains = data.domains or []
      message = domains[0]
      message.task = "ackHome"
      browser.tabs.sendMessage sender.tab.id, message
  isCSP : (headerName) ->
    (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')
  headerFilter :
      {
        urls: ["https://github.com/*"]
        types: ["main_frame"]
      }
  cspAppender : (domain) ->
      @domain = domain
      (details) => 
        for header in details.responseHeaders
            if codesy.isCSP header.name.toUpperCase()
              notify "Appending CSP"
              console.log "codesy: appending CSP"
              header.value = header.value.replace('connect-src', 'connect-src '+ @domain) # required for FF not Chrome
              header.value = header.value.replace('script-src' , 'script-src ' + @domain)
              header.value = header.value.replace('style-src'  , 'style-src '  + @domain)
              header.value = header.value.replace('frame-src'  , 'frame-src '  + @domain)
              header.value = header.value.replace('child-src'  , 'child-src '  + @domain)
        {responseHeaders: details.responseHeaders}
    
chrome.runtime.onMessage.addListener (message,sender) -> 
    console.log message
    switch message.task
      when "setHome"
        codesy.add message
      when "getHome"
        codesy.get sender

# Listens for github CSP
chrome.storage.local.get "domains",(data) ->
  codesy.addCodesy = new codesy.cspAppender ( data[0].domain)
  chrome.webRequest.onHeadersReceived.addListener codesy.addCodesy, codesy.headerFilter, ["responseHeaders","blocking"]

chrome.storage.onChanged.addListener (changes)->
  if changes.domains.newValue[0].domain?
    if codesy.addCodesy?
      chrome.webRequest.onHeadersReceived.removeListener codesy.addCodesy
    codesy.addCodesy = new codesy.cspAppender changes.domains.newValue[0].domain
    chrome.webRequest.onHeadersReceived.addListener codesy.addCodesy, codesy.headerFilter, ["responseHeaders","blocking"]



