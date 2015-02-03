var codesy, new_token;

if ($(".installed").length > 0) {
  $(".install-step").hide();
  $(".installed").show();
}

codesy = {};

codesy.find = function(domains, domain) {
  return domains.map(function(item) {
    return item.domain;
  }).indexOf(domain);
};

console.time("codesy: token set");

new_token = {
  'domain': window.location.href,
  'token': $("#api_token_pass").val() || ""
};

chrome.storage.local.get(function(data) {
  var isSaved;
  console.log("codesy: local data");
  data.domains = data.domains || [];
  isSaved = codesy.find(data.domains, new_token.domain);
  if (isSaved !== -1) {
    data.domains.splice(isSaved, 1);
  }
  data.domains.unshift(new_token);
  return chrome.storage.local.set(data);
});

console.timeEnd("codesy: token set");
