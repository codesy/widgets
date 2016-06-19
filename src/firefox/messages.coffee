codesy =
    add : (message)->
        chrome.storage.local.get "domain", (data) ->
            chrome.storage.local.set {domain : message.domain}
    get : (sender) ->
        chrome.storage.local.get "domain", (data) ->
            message =
                task: "ackHome"
                domain: data.domain or ""
            browser.tabs.sendMessage sender.tab.id, message

chrome.runtime.onMessage.addListener (message,sender) ->
    console.log message
    switch message.task
        when "setHome"
            codesy.add message
        when "getHome"
            codesy.get sender
