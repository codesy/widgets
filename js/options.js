var domains, loadOptions, saveOptions;

saveOptions = function() {
  var domain, status;
  domain = $("#domain_list").val();
  chrome.storage.local.set({
    domain: domain
  });
  chrome.storage.local.get(function(options) {
    return codesy.options = options;
  });
  status = document.getElementById("status");
  status.innerHTML = "Saved.";
  setTimeout((function() {
    return status.innerHTML = "";
  }), 750);
};

loadOptions = function() {
  $.each(domains, function(i, v) {
    return $("#domain_list").append($("<option>").attr("value", v).text(v));
  });
  return chrome.storage.local.get(function(options) {
    var domain;
    domain = options.domain;
    if (!domain) {
      domain = "api.codesy.io";
    }
    return $("#domain_list").val(domain);
  });
};

domains = ["api.codesy.io", "codesy-stage.herokuapp.com", "127.0.0.1:8000"];

document.addEventListener("DOMContentLoaded", loadOptions);

document.querySelector("button#save").addEventListener("click", saveOptions);
