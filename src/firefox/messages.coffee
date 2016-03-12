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
    
chrome.runtime.onMessage.addListener (message,sender) -> 
    console.log message
    switch message.task
      when "setHome"
        codesy.add message
      when "getHome"
        codesy.get sender
