console.time "codesy: check token"
if $("#token_element").length > 0
  console.log "codesy: found token"
  chrome.storage.local.set auth_token: $("#token_element").val()
console.timeEnd "codesy: check token"  