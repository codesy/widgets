var codesy;

codesy = {
  add: function(message) {
    return chrome.storage.local.get("domain", function(data) {
      return chrome.storage.local.set({
        domain: message.domain
      });
    });
  },
  get: function(sender) {
    return chrome.storage.local.get("domain", function(data) {
      var message;
      message = {
        task: "ackHome",
        domain: data.domain || ""
      };
      return browser.tabs.sendMessage(sender.tab.id, message);
    });
  }
};

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log(message);
  switch (message.task) {
    case "setHome":
      return codesy.add(message);
    case "getHome":
      return codesy.get(sender);
  }
});
