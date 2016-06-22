console.time 'codesy issue load'

codesy =
    href : ""
    rx : /https:\/\/github.com\/.*\/issues\/[1-9]+/g
    iframe :
        attr:
            id : "codesy_iframe"
            style: "visibility: collapse;"
            scrolling: "no"
            seamless: "seamless"
    bid_url : (issue_url) ->
            codesy.domain +  '/bid-status/?' + $.param({url:issue_url})

onChrome = chrome.storage ? false

if onChrome
    codesy.getHome = () ->
        chrome.storage.local.get null,(data) ->
            codesy.domain = data.domain
            codesy.newpage()
else # firefox
    codesy.getHome = () ->
        chrome.runtime.sendMessage { task : "getHome"  }
    chrome.runtime.onMessage.addListener (message) ->
        switch message.task
            when 'ackHome'
                codesy.domain = message.domain
                codesy.newpage()

codesy.newpage = () ->
    $("#"+codesy.iframe.attr.id).remove()
    if codesy.rx.test window.location.href
        codesy.iframe.attr.src = codesy.bid_url window.location.href
        $('body').append $('<iframe>').attr(codesy.iframe.attr)
        $("head").append('<link rel="stylesheet" type="text/css" href="'+codesy.domain+'/static/css/codesy-iframe.css">')
        console.log("codesy newpage: iFrame added")
    else
        console.log "codesy newpage: not an issue"

codesy.urlChange = () ->
    if codesy.href isnt window.location.href
        console.log "codesy: url changed"
        codesy.href = window.location.href
        codesy.getHome()
    window.setTimeout codesy.urlChange, 600

codesy.urlChange()

window.onpopstate = ->
    console.log "codesy: popstate"
    codesy.getHome()

console.timeEnd 'codesy issue load'
