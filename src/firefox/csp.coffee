notify = (msg) ->
  chrome.notifications.create ({
    title: "codesy"
    message: msg
    iconUrl: "img/icon128.png"
  })

isCSPHeader = (headerName) ->
  (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')
 
headerFilter =     
    {
      urls: ["https://github.com/*"]
      types: ["main_frame"]
    }
    
cspAppender = (domain) ->
    @domain = domain
    (details) => 
      for header in details.responseHeaders
          if isCSPHeader header.name.toUpperCase()
              console.log "codesy: appending CSP"
              notify "appended CSP"
              header.value = header.value.replace('connect-src', 'connect-src'+ @domain)
              header.value = header.value.replace('script-src', 'script-src '+ @domain)
              header.value = header.value.replace('style-src', 'style-src '+ @domain)
              header.value = header.value.replace('frame-src', 'frame-src '+ @domain)
      {responseHeaders: details.responseHeaders}

addCodesy = new cspAppender ( "https://127.0.0.1:8443" )
chrome.webRequest.onHeadersReceived.addListener addCodesy, headerFilter, ["blocking","responseHeaders"]
  

      




