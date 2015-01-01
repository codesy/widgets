var loadOptions, saveOptions;

loadOptions = function() {
  return chrome.storage.local.get(function(options) {
    return $("#auth_token").val(options.auth_token);
  });
};

document.addEventListener("DOMContentLoaded", loadOptions);

saveOptions = function() {
  var auth_token, status;
  auth_token = $("#auth_token").val();
  chrome.storage.local.set({
    auth_token: auth_token
  });
  status = document.getElementById("status");
  status.innerHTML = "Saving ...";
  return setTimeout((function() {
    return status.innerHTML = "";
  }), 750);
};

document.querySelector("button#save").addEventListener("click", saveOptions);
