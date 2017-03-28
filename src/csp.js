
githubFilter = {
    urls: ["https://github.com/*"],
    types: ["main_frame"]
};

const makeCspAppender = function(domain='') {
    const types = ['connect-src', 'child-src', 'script-src', 'style-src'];
    const isCSP = function ({ name: maybe_lower }) {
        const name = maybe_lower.toUpperCase()
        return (name === 'CONTENT-SECURITY-POLICY') || (name === 'X-WEBKIT-CSP');
    };
    return function({responseHeaders: headers}) {
        for (header of headers) {
            if ( isCSP(header) ) {
                for (type of types) {
                    header.value = header.value.replace(type, `${type} 'self' ${domain} `);
                }
            }
        }
        return {responseHeaders: headers};
    }
};

let codesyAppender;

const addCodesy = function(domain) {
    if (chrome.webRequest.onHeadersReceived.hasListener(codesyAppender)) {
        chrome.webRequest.onHeadersReceived.removeListener(codesyAppender);
    }
    codesyAppender = new makeCspAppender(domain);
    return chrome.webRequest.onHeadersReceived.addListener(codesyAppender, githubFilter, ["responseHeaders", "blocking"]);
};

chrome.storage.local.get(null, function({domain}) {
    return addCodesy(domain);
});

chrome.storage.onChanged.addListener(
    function({domain: {newValue:domain} }, namespace) {
        if (domain) {
            return addCodesy(domain);
        }
    }
);
