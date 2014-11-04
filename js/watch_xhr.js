var filter, watch;

watch = function(details) {
  console.log("xhr sent");
  return chrome.tabs.getSelected(null, function(tabs) {
    return chrome.tabs.sendMessage(tabs.id, {
      action: "xhr"
    });
  });
};

filter = {
  url: [
    {
      originAndPathMatches: ".*/github.com/.*/.*/issues/.*"
    }
  ]
};

chrome.webNavigation.onHistoryStateUpdated.addListener(watch, filter);
