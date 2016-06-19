console.log "codesy home page"
console.time "codesy home"
# replace the install instructions with a check mark
if $(".installed").length > 0
    $(".install-step").hide()
    $(".installed").show()

codesy={}

isChrome = chrome.storage ? false

if isChrome
    codesy.storeDomain = (domain)->
        chrome.storage.local.get null,(data) ->
            data.domain = domain or ""
            chrome.storage.local.set(data);
else # firefox
    codesy.storeDomain = (domain)->
        message =
            task : "setHome"
            domain : domain
        chrome.runtime.sendMessage message

codesy.storeDomain(window.location.origin)

console.timeEnd  "codesy home"
