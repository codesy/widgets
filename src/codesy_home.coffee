# replace the install instructions with a check mark
if $(".installed").length > 0
  $(".install-step").hide()
  $(".installed").show()


codesy={}
codesy.find = (domains,domain) ->
  domains.map((item) -> item.domain).indexOf(domain)


console.time("codesy: token set");

new_token = 
  'domain': window.location.href
  'token': $("#api_token_pass").val() or ""
      
chrome.storage.local.get (data) ->
  console.log "codesy: local data"
  data.domains = data.domains or []
  isSaved = codesy.find(data.domains,new_token.domain)
  data.domains.splice(isSaved, 1) if isSaved isnt -1
  data.domains.unshift(new_token)
  chrome.storage.local.set(data);

console.timeEnd("codesy: token set");
