
isCSPHeader = (headerName) ->
  (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')
 
headerFilter =     
    {
      urls: ["https://github.com/*"]
      types: ["main_frame"]
    }

cspAppend = (domain) ->
    @domain = domain
    (details) => 
      for header in details.responseHeaders
          if isCSPHeader(header.name.toUpperCase())
              header.value = header.value.replace('script-src', 'script-src '+ @domain)
              header.value = header.value.replace('style-src', 'style-src '+ @domain)
              header.value = header.value.replace('frame-src', 'frame-src '+ @domain)
      {responseHeaders: details.responseHeaders}
        
chrome.storage.local.get (data) ->
    addCodesy = new cspAppend ( data.domains[0].domain)
    # Listens for github CSP
    chrome.webRequest.onHeadersReceived.addListener addCodesy, headerFilter, ["responseHeaders","blocking"]

    
chrome.storage.onChanged.addListener (changes, namespace) ->
  console.log "codesy: storage changed"
  if changes.domains.newValue[0].domain
      addCodesy = new cspAppend (changes.domains.newValue[0].domain)

      
# chrome.runtime.onMessage.addListener (msg, sender, sendResponse) ->
#   console.log "codesy: xhr received"
#   if msg.url
#     codesy.newpage()




