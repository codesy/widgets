var filter, watch;

watch = function(details) {
  return chrome.tabs.getSelected(null, function(tabs) {
    console.log("xhr sent to: " + tabs.url + ":" + tabs.id);
    return chrome.tabs.sendMessage(tabs.id, {
      action: "xhr"
    });
  });
};

filter = {
  url: [
    {
      originAndPathMatches: ".*/github.com/.*/.*/issues/*"
    }
  ]
};

chrome.webNavigation.onHistoryStateUpdated.addListener(watch, filter);
