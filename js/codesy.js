var call_map, codesy, event, value, _fn, _i, _len;

event = new Event('hide_install');

document.dispatchEvent(event);

codesy = {};

codesy.api = {};

codesy.options = {
  endpoint: "/api",
  version: "/v1",
  domain: "127.0.0.1:5000"
};

chrome.storage.local.set({
  options: codesy.options
});

codesy.api.raw = function(resource, ajax_params) {
  ajax_params = ajax_params || {};
  return $.ajax({
    type: "get",
    url: "https://" + codesy.options.domain + resource,
    data: ajax_params,
    dataType: "html"
  });
};

call_map = [["bids", "/bids"]];

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
  $(select).first().append(cdsyForm);
  if ($("#codesy-widget").length > 0) {
    dfd.resolve();
  } else {
    dfd.reject();
  }
  return dfd.promise();
};

document.addEventListener('install_check', codesy.install_check);

codesy.href = window.location.href;

codesy.ask = function(url) {
  return codesy.api.bids(window.location.href).done(function(data) {
    var container, selector;
    console.log({
      codesy: data
    });
    selector = $(data).data('selector');
    container = $(data).data('container');
    if ($(selector).length > 0) {
      return codesy.appendForm(selector, data, container);
    }
  }).fail(function(data) {
    console.log("$.ajax failed.");
    return console.log(data);
  });
};

codesy.ask(codesy.href);

codesy.watch = function() {
  if (codesy.href !== window.location.href) {
    codesy.href = window.location.href;
    return codesy.ask(codesy.href);
  }
};

window.setInterval(codesy.watch, 500);
