console.log "codesy home page"

# replace the install instructions with a check mark
if $(".installed").length > 0
   $(".install-step").hide()
   $(".installed").show()

codesy={}
  
codesy.find = (domains,domain) ->
  domains.map((item) -> item.domain).indexOf(domain)

if chrome 
  codesy.save = (domain)->
    chrome.storage.local.get (data) ->
      console.log "codesy: local data"
      data.domains = data.domains or []
      isSaved = codesy.find(data.domains,domain.domain)
      data.domains.splice(isSaved, 1) if isSaved isnt -1
      data.domains.unshift(domain)
      chrome.storage.local.set(data);
  
else
  codesy.save = (domain)->
    data = JSON.parse(localStorage.getItem('data')) or {}
    data.domains = data.domains or []
    isSaved = codesy.find(data.domains,domain.domain)
    data.domains.splice(isSaved, 1) if isSaved isnt -1
    data.domains.unshift(new_token)
    localStorage.setItem('data',JSON.stringify(data))

new_token = 
  'domain': window.location.href
  'token': $("#api_token_pass").val() or ""
      
codesy.save(new_token)

console.log "codesy: home page script loaded"