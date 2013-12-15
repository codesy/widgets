var domains=['api.codesy.io','codesy-stage-herokuapp.com','codesy-dev-herokuapp.com']


function saveOptions() {
  var domain = $('#domain_list').val();
  chrome.storage.local.set({"domain": domain});
  
  var status = document.getElementById("status");
  status.innerHTML = "Saved.";
  
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}


function loadOptions() {
    $.each(domains,function(i,v){
        $('#domain_list').append(
            $('<option>')
            .attr('value',v)
            .text(v)
        );
    })
  chrome.storage.local.get(function(options){
    var domain = options.domain;
    if (!domain) { domain = "api.codesy.io"; }
    $("#domain_list").val(domain);
  });
  
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('button#save').addEventListener('click', saveOptions);
