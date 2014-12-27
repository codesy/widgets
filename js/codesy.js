var codesy;

codesy = {
  options: {
    endpoint: "/api",
    version: "/v1",
    domain: "mysterious-badlands-8311.herokuapp.com/",
    url: function() {
      return "https://" + this.domain;
    }
  },
  api: {},
  current: {
    url: null
  }
};

chrome.storage.local.get(function(data) {
  return codesy.options.domain = data.domain;
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

codesy.api.bid = function(params) {
  return codesy.api.raw('/bid/', params);
};

codesy.isIssue = function(url) {
  var rx;
  rx = /https:\/\/github.com\/.*\/issues\/./g;
  return rx.test(url);
};

codesy.appendForm = function(cdsyForm) {
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

codesy.newpage = function() {
  $("#codesy_form").remove();
  if (codesy.isIssue(window.location.href)) {
    return codesy.api.bid({
      url: window.location.href
    }).done(function(data) {
      console.log(data);
      return codesy.appendForm(data);
    }).fail(function(data) {
      return console.log("$.ajax failed.");
    });
  }
};

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("xhr received");
  if (msg.url) {
    return codesy.newpage();
  }
});

window.onpopstate = function() {
  console.log("popstate");
  return codesy.newpage();
};

codesy.newpage();
