console.log "codesy home page"
console.time "codesy home"
# replace the install instructions with a check mark
if $(".installed").length > 0
   $(".install-step").hide()
   $(".installed").show()

codesy={}

isChrome = chrome.storage ? false

if isChrome
  codesy.find = (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)

  codesy.save = (home)->
    chrome.storage.local.get null,(data) ->
      console.log "codesy: local data"
      data.domains = data.domains or []
      idx = codesy.find(data.domains,home.domain)
      data.domains.splice(idx, 1) if idx isnt -1
      data.domains.unshift(home)
      chrome.storage.local.set(data);

else # firefox
  codesy.save = (home)->
    console.log "save domain: " + home.domain
    chrome.runtime.sendMessage home

$token = $("#api_token_pass")

codesy_home =
  'task' : "setHome"
  'domain': window.location.origin
  'token': $token.val() or ""

codesy.save(codesy_home)

console.timeEnd  "codesy home"