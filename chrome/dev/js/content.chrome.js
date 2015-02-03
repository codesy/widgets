var CodesyAjax, codesy;

console.time('codesy load');

codesy = {
  auth: {
    domain: "",
    token: ""
  },
  bid: {},
  events: {}
};

CodesyAjax = (function() {
  function CodesyAjax() {
    this.beforeSend = (function() {
      return function(xhr, settings) {
        return xhr.setRequestHeader("Authorization", "Token " + codesy.auth.token);
      };
    })();
    this.dataType = "html";
    this;
  }

  return CodesyAjax;

})();

codesy.bid.get = function(ajax_params) {
  var ajax_options;
  ajax_options = new CodesyAjax;
  ajax_options.data = ajax_params || {};
  ajax_options.type = "get";
  ajax_options.url = codesy.auth.domain + 'bid/';
  return $.ajax(ajax_options);
};

codesy.bid.update = function($form) {
  var ajax_options;
  $form = $form || [];
  ajax_options = new CodesyAjax;
  ajax_options.data = $form.serialize();
  ajax_options.type = $form.attr('method');
  ajax_options.url = $form.attr('action');
  return $.ajax(ajax_options);
};

codesy.isIssue = function(href) {
  var rx;
  console.log('codesy isIssue : ' + href);
  rx = /https:\/\/github.com\/.*\/issues\/[1-9]+/g;
  return rx.test(href);
};

codesy.events.submit = function(e) {
  e.preventDefault();
  codesy.bid.update($(this)).done(function(data) {
    console.log('codesy: bid update successful');
    return codesy.newpage();
  }).fail(function(err) {
    console.log('codesy: bid update failed');
    console.dir(err);
    return console.dir(codesy);
  });
  return false;
};

codesy.append = function(form_html) {
  $("body").append(form_html);
  if ($("#codesy_bid_form").length > 0) {
    return $("#codesy_bid_form").submit(codesy.events.submit);
  }
};

codesy.newpage = function() {
  $("#codesy_bid").remove();
  if (codesy.isIssue(window.location.href)) {
    console.log('codesy: needs bid form');
    console.time("codesy: request form");
    return codesy.bid.get({
      url: window.location.href
    }).done(function(data) {
      console.timeEnd("codesy: request form");
      console.log("codesy: form request success");
      return codesy.append(data);
    }).fail(function(err) {
      console.timeEnd("codesy: request form");
      console.log("codesy: form request failed");
      if (err.status === 401) {
        return codesy.append(err.responseText);
      } else {
        return console.log(err);
      }
    });
  }
};

codesy.auth.set = function(auth) {
  console.log("codesy: new domain is " + auth.domain);
  codesy.auth.token = auth.token;
  codesy.auth.domain = auth.domain;
  return codesy.newpage();
};

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

window.onpopstate = function() {
  console.log("codesy: popstate");
  return codesy.newpage();
};

console.timeEnd('codesy load');
