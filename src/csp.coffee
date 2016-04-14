githubFilter =     
    {
      urls: ["https://github.com/*"]
      types: ["main_frame"]
    }
    
cspAppender = (domain) ->
    @domain = domain
    types = ['connect-src','frame-src','script-src','style-src']
    @isCSP = (headerName) ->
        (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')
    (details) => 
      for header in details.responseHeaders
          if @isCSP header.name.toUpperCase()
              for type in types
                header.value = header.value.replace(type, type + " " + @domain)
      {responseHeaders: details.responseHeaders}

addCodesy = new cspAppender ""

chrome.storage.local.get null,(data) ->
    addCodesy = new cspAppender ( data.domains[0].domain)
    # Listens for github CSP
    chrome.webRequest.onHeadersReceived.addListener addCodesy, githubFilter, ["responseHeaders","blocking"]
   
chrome.storage.onChanged.addListener (changes, namespace) ->
  console.log "codesy: storage changed"
  if changes.domains.newValue[0].domain
    if chrome.webRequest.onHeadersReceived.hasListener addCodesy
      chrome.webRequest.onHeadersReceived.removeListener addCodesy
    addCodesy = new cspAppender (changes.domains.newValue[0].domain)
    chrome.webRequest.onHeadersReceived.addListener addCodesy, githubFilter, ["responseHeaders","blocking"]
      




