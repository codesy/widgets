function saveOptions() {
  var domain = document.getElementById("domain").value;
  chrome.storage.local.set({"domain": domain});
  
  var status = document.getElementById("status");
  status.innerHTML = "Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function loadOptions() {
  chrome.storage.local.get(function(options){
    var domain = options.domain;
    if (!domain) { domain = "api.codesy.io"; }
    document.getElementById("domain").value = domain;
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('button#save').addEventListener('click', saveOptions);
