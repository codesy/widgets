var codesy, onChrome, ref;

console.time('codesy issue load');

codesy = {
  href: "",
  rx: /https:\/\/github.com\/.*\/issues\/[1-9]+/g,
  css: {
    attr: {
      rel: "stylesheet",
      type: "text/css",
      href: ""
    }
  },
  iframe: {
    attr: {
      id: "codesy_iframe",
      style: "visibility: collapse;",
      scrolling: "no",
      seamless: "seamless"
    }
  },
  bid_url: function(issue_url) {
    return codesy.domain + '/bid-status/?' + $.param({
      url: issue_url
    });
  }
};

onChrome = (ref = chrome.storage) != null ? ref : false;

if (onChrome) {
  codesy.getHome = function() {
    return chrome.storage.local.get(null, function(data) {
      codesy.domain = data.domain;
      return codesy.newpage();
    });
  };
} else {
  codesy.getHome = function() {
    return chrome.runtime.sendMessage({
      task: "getHome"
    });
  };
  chrome.runtime.onMessage.addListener(function(message) {
    switch (message.task) {
      case 'ackHome':
        codesy.domain = message.domain;
        return codesy.newpage();
    }
  });
}

codesy.loadcss = function() {
  console.log("codesy newpage: iFrame loaded");
  codesy.css.attr.href = chrome.extension.getURL("css/iframe.css");
  return $("head").append($('<link>').attr(codesy.css.attr));
};

codesy.newpage = function() {
  var new_iframe;
  $("#" + codesy.iframe.attr.id).remove();
  if (codesy.rx.test(window.location.href)) {
    codesy.iframe.attr.src = codesy.bid_url(window.location.href);
    new_iframe = $('body').append($('<iframe>').attr(codesy.iframe.attr));
    return new_iframe.ready(codesy.loadcss);
  } else {
    return console.log("codesy newpage: not an issue");
  }
};

codesy.urlChange = function() {
  if (codesy.href !== window.location.href) {
    console.log("codesy: url changed");
    codesy.href = window.location.href;
    codesy.getHome();
  }
  return window.setTimeout(codesy.urlChange, 600);
};

codesy.urlChange();

window.onpopstate = function() {
  console.log("codesy: popstate");
  return codesy.getHome();
};

console.timeEnd('codesy issue load');
