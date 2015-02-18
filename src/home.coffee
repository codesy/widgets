console.log "codesy home page"

# replace the install instructions with a check mark
if $(".installed").length > 0
   $(".install-step").hide()
   $(".installed").show()

codesy={}

chrome = chrome ? false

if chrome 
  codesy.find = (domains,domain) ->
    domains.map((item) -> item.domain).indexOf(domain)

  codesy.save = (domain)->
    chrome.storage.local.get (data) ->
      console.log "codesy: local data"
      data.domains = data.domains or []
      idx = codesy.find(data.domains,domain.domain)
      data.domains.splice(idx, 1) if idx isnt -1
      data.domains.unshift(domain)
      chrome.storage.local.set(data);

else # firefox
  codesy.save = (domain)->
    self.port.emit "newDomain", domain

new_domain = 
  'domain': window.location.origin
  'token': $("#api_token_pass").val() or ""
      
codesy.save(new_domain)

console.log "codesy: home page script loaded"