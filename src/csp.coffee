githubFilter =
    urls: ["https://github.com/*"]
    types: ["main_frame"]

cspAppender = (domain) ->
    domains = [" 'self'", domain]
    @domain =  domains.join(' ')
    types = ['connect-src','child-src','script-src','style-src']
    @isCSP = (headerName) ->
        (headerName is 'CONTENT-SECURITY-POLICY') or (headerName is 'X-WEBKIT-CSP')
    (details) =>
      for header in details.responseHeaders
          if @isCSP header.name.toUpperCase()
              for type in types
                header.value = header.value.replace(type, type + @domain)
      {responseHeaders: details.responseHeaders}

codesyAppender = new cspAppender ""

addCodesy = (new_domain)->
    if chrome.webRequest.onHeadersReceived.hasListener codesyAppender
        chrome.webRequest.onHeadersReceived.removeListener codesyAppender
    codesyAppender = new cspAppender new_domain
    chrome.webRequest.onHeadersReceived.addListener codesyAppender, githubFilter, ["responseHeaders","blocking"]

chrome.storage.local.get null,(data) ->
    addCodesy data.domain

chrome.storage.onChanged.addListener (changes, namespace) ->
    new_domain = changes.domain.newValue
    if new_domain
        addCodesy new_domain
