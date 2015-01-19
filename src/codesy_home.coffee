# replace the install instructions with a check mark

if $(".installed").length > 0
  $(".install-step").hide()
  $(".installed").show()

console.time("codesy: check token");

if $("#api_token_pass").length > 0
  token_found = $("#api_token_pass").val()
  if token_found isnt "" 
    console.log("codesy: found token");
    new_token = 
      'domain': window.location.href
      'token': token_found
      
    chrome.storage.local.get (data) ->
      console.log "codesy: local data"
      console.dir data
      data.domains = data.domains or []
      isSaved = data.domains
        .map((item) -> item.domain)
          .indexOf(new_token.domain)
      if isSaved isnt -1
        data.domains.splice(isSaved, 1)
      data.domains.unshift(new_token)
      console.log "codesy: new local data"
      console.dir data
      chrome.storage.local.set(data);

console.timeEnd("codesy: check token");
