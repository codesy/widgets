chrome.storage.local.get(function(data) {
  return codesy.auth.set(data.domains[0]);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log("codesy: token changed");
  if (changes.domains.newValue[0].domain) {
    return codesy.auth.set(changes.domains.newValue[0]);
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("codesy: xhr received");
  if (msg.url) {
    return codesy.newpage();
  }
});
