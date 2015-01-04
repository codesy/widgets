var codesy;

console.time('codesy load');

codesy = {
  options: {
    form: {
      heigth: 100,
      width: 100
    },
    url: "https://127.0.0.1:8443"
  },
  form: null,
  bid: {},
  current: {
    url: null
  }
};

codesy.auth_token = function() {
  if (codesy.options.auth_token) {
    return codesy.options.auth_token;
  } else {

  }
};

codesy.bid.get = function(ajax_params) {
  console.log('codesy: ' + codesy.options.auth_token);
  ajax_params = ajax_params || {};
  return $.ajax({
    beforeSend: function(xhr, settings) {
      return xhr.setRequestHeader("Authorization", "Token " + codesy.options.auth_token);
    },
    type: "get",
    url: codesy.options.url + '/bid/',
    data: ajax_params,
    dataType: "html"
  });
};

codesy.bid.update = function(form) {
  form = form || {};
  return $.ajax({
    beforeSend: function(xhr, settings) {
      return xhr.setRequestHeader("Authorization", "Token " + codesy.options.auth_token);
    },
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize(),
    dataType: "html",
    success: function(data) {
      return codesy.newpage();
    },
    error: function(err) {
      console.log('codesy: bid update failed');
      return console.log(err);
    }
  });
};

codesy.isIssue = function(url) {
  var rx;
  console.log('codesy isIssue : ' + url);
  rx = /https:\/\/github.com\/.*\/issues\/./g;
  return rx.test(url);
};

codesy.appendForm = function(form_html) {
  var dfd;
  dfd = new $.Deferred();
  $("body").append(form_html);
  if ($("#codesy_bid_form").length > 0) {
    codesy.form = $("#codesy_bid_form");
    codesy.form.submit(function(e) {
      e.preventDefault();
      codesy.bid.update(codesy.form);
      return false;
    });
    dfd.resolve();
  } else {
    dfd.reject();
  }
  return dfd.promise();
};

codesy.newpage = function() {
  $("#codesy_bid_form").remove();
  if (codesy.isIssue(window.location.href)) {
    console.log('codesy: needs bid form');
    console.time("codesy: request form");
    return codesy.bid.get({
      url: window.location.href
    }).done(function(data) {
      console.timeEnd("codesy: request form");
      return codesy.appendForm(data);
    }).fail(function(data) {
      console.timeEnd("codesy: request form");
      console.log("codesy: $.ajax failed.");
      return console.log(data);
    });
  }
};

chrome.storage.local.get(function(data) {
  codesy.options.auth_token = data.auth_token;
  return codesy.newpage();
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log("codesy: xhr received");
  if (msg.url) {
    return codesy.newpage();
  }
});

window.onpopstate = function() {
  console.log("codesy: popstate");
  return codesy.newpage();
};

console.timeEnd('codesy load');
