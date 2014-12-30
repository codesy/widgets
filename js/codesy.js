var codesy;

codesy = {
  options: {
    endpoint: "/api",
    version: "/v1",
    domain: "mysterious-badlands-8311.herokuapp.com/",
    form: {
      heigth: 100,
      width: 100
    },
    url: function() {
      return "https://" + this.domain;
    }
  },
  form: null,
  api: {},
  current: {
    url: null
  }
};

chrome.storage.local.get(function(data) {
  return codesy.options.auth_token = data.auth_token;
});

codesy.api.get = function(resource, ajax_params) {
  ajax_params = ajax_params || {};
  return $.ajax({
    type: "get",
    url: codesy.options.url() + resource,
    data: ajax_params,
    dataType: "html"
  });
};

codesy.auth_token = function() {
  if (codesy.options.auth_token) {
    return codesy.options.auth_token;
  } else {
    return codesy.getAuthOption();
  }
};

codesy.api.put = function(form) {
  return $.ajax({
    beforeSend: function(xhr, settings) {
      return xhr.setRequestHeader("Authorization", "Token " + codesy.auth_token());
    },
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize(),
    dataType: "html",
    success: function() {
      return codesy.newpage();
    },
    error: function(err) {
      return console.log(err);
    }
  });
};

codesy.api.bid = function(params) {
  return codesy.api.get('/bid/', params);
};

codesy.isIssue = function(url) {
  var rx;
  rx = /https:\/\/github.com\/.*\/issues\/./g;
  return rx.test(url);
};

codesy.positionForm = function() {
  var footerLeft, footerTop;
  footerTop = $(window).scrollTop() + $(window).height() - codesy.options.form.heigth;
  footerLeft = $(window).width() - codesy.options.form.width;
  if (($(document.body).height() + footerTop) > $(window).height()) {
    return codesy.form.css({
      position: "absolute",
      top: footerTop,
      left: footerLeft
    });
  } else {
    return codesy.form.css({
      position: "static",
      top: footerTop,
      left: footerLeft
    });
  }
};

codesy.appendForm = function(cdsyForm) {
  var dfd;
  dfd = new $.Deferred();
  $("body").append(cdsyForm);
  if ($("#codesy_bid_form").length > 0) {
    codesy.form = $("#codesy_bid_form");
    $(window).scroll(codesy.positionForm).resize(codesy.positionForm);
    codesy.positionForm();
    dfd.resolve();
  } else {
    dfd.reject();
  }
  return dfd.promise();
};

codesy.newpage = function() {
  $("#codesy_bid_form").remove();
  if (codesy.isIssue(window.location.href)) {
    return codesy.api.bid({
      url: window.location.href
    }).done(function(html_form) {
      console.log(html_form);
      return codesy.appendForm(html_form).done(function() {
        return codesy.form.submit(function(e) {
          codesy.api.put(codesy.form);
          return false;
        });
      });
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
