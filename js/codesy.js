var call_map, codesy, fake_form, value, _fn, _i, _len;

fake_form = "<style type=\"text/css\">\n  div { border: solid red;  max-width: 70ex; }\n  h4  { float: left;  margin: 0; }\n</style> \n<form id=\"fake_form\" action=\"/bids/\" method=\"post\" data-selector=\".discussion-sidebar\" data-container=\"\">\n  {% csrf_token %}\n  <input name=\"url\" type=\"hidden\" value=\"{{ bid.url }}\"></input>\n  <p>\n  <input name=\"ask\" type=\"text\" placeholder=\"ask\" value=\"{{ bid.ask }}\"></input>\n  </p>\n  <p>\n  <input name=\"offer\" type=\"text\" placeholder=\"offer\" value=\"{{ bid.offer }}\"></input>\n  </p>\n  <input type=\"submit\" value=\"Bid\" />\n</form>";

codesy = {
  options: {
    endpoint: "/api",
    version: "/v1",
    domain: "127.0.0.1:8000",
    url: function() {
      return "https://" + this.domain;
    }
  },
  api: {}
};

chrome.storage.local.set({
  options: codesy.options
});

codesy.api.raw = function(resource, ajax_params) {
  ajax_params = ajax_params || {};
  return $.ajax({
    type: "get",
    url: codesy.options.url() + resource,
    data: ajax_params,
    dataType: "html"
  });
};

call_map = [["bids", "/bids"], ["bid", "/bid/"]];

_fn = function(value) {
  return codesy.api[value[0]] = function(params) {
    return codesy.api.raw(value[1], params);
  };
};
for (_i = 0, _len = call_map.length; _i < _len; _i++) {
  value = call_map[_i];
  _fn(value);
}

codesy.appendForm = function(select, cdsyForm, containers) {
  var dfd;
  dfd = new $.Deferred();
  $("body").append(cdsyForm);
  if ($("#codesy-widget").length > 0) {
    dfd.resolve();
  } else {
    dfd.reject();
  }
  return dfd.promise();
};

codesy.ask = function(url) {
  console.log("checking " + codesy.current.url);
  codesy.appendForm("body", fake_form);
  return;
  return codesy.api.bid({
    url: codesy.current.url
  }).done(function(data) {
    console.log({
      codesy: data
    });
    return codesy.appendForm(data);
  }).fail(function(data) {
    return console.log("$.ajax failed.");
  });
};

codesy.current = {
  url: null
};

codesy.launch = function() {
  var _base;
  console.log((_base = codesy.current).url != null ? _base.url : _base.url = "null" + " = " + window.location.href);
  if (window.location.href !== codesy.current.url) {
    codesy.current.url = window.location.href;
    return codesy.ask();
  }
};

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("xhr received");
  if (msg.action === "xhr") {
    return codesy.launch();
  }
});

window.onpopstate = function() {
  console.log("popstate");
  return codesy.launch();
};

codesy.launch();
