var filter, watch;

watch = function(details) {
  return chrome.tabs.getSelected(null, function(tabs) {
    console.log("xhr sent: " + tabs.url);
    return chrome.tabs.sendMessage(tabs.id, {
      url: tabs.url
    });
  });
};

filter = {
  url: [
    {
      originAndPathMatches: ".*/github.com/.*/.*"
    }
  ]
};

chrome.webNavigation.onHistoryStateUpdated.addListener(watch, filter);
