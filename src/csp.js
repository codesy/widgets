var addCodesy, codesyAppender, cspAppender, githubFilter;

githubFilter = {
  urls: ["https://github.com/*"],
  types: ["main_frame"]
};

cspAppender = function(domain) {
  var domains, types;
  domains = [" 'self'", domain];
  this.domain = domains.join(' ');
  types = ['connect-src', 'child-src', 'script-src', 'style-src'];
  this.isCSP = function(headerName) {
    return (headerName === 'CONTENT-SECURITY-POLICY') || (headerName === 'X-WEBKIT-CSP');
  };
  return (function(_this) {
    return function(details) {
      var header, i, j, len, len1, ref, type;
      ref = details.responseHeaders;
      for (i = 0, len = ref.length; i < len; i++) {
        header = ref[i];
        if (_this.isCSP(header.name.toUpperCase())) {
          for (j = 0, len1 = types.length; j < len1; j++) {
            type = types[j];
            header.value = header.value.replace(type, type + _this.domain);
          }
        }
      }
      return {
        responseHeaders: details.responseHeaders
      };
    };
  })(this);
};

codesyAppender = new cspAppender("");

addCodesy = function(new_domain) {
  if (chrome.webRequest.onHeadersReceived.hasListener(codesyAppender)) {
    chrome.webRequest.onHeadersReceived.removeListener(codesyAppender);
  }
  codesyAppender = new cspAppender(new_domain);
  return chrome.webRequest.onHeadersReceived.addListener(codesyAppender, githubFilter, ["responseHeaders", "blocking"]);
};

chrome.storage.local.get(null, function(data) {
  return addCodesy(data.domain);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  var new_domain;
  new_domain = changes.domain.newValue;
  if (new_domain) {
    return addCodesy(new_domain);
  }
});
