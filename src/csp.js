
githubFilter = {
    urls: ["https://github.com/*"],
    types: ["main_frame"]
};

const makeCspAppender = function(domain) {
    const new_domain = ` 'self' ${domain}`
    const types = ['connect-src', 'child-src', 'script-src', 'style-src'];
    const isCSP = function ({ name: maybe_lower }) {
        const name = maybe_lower.toUpperCase()
        return (name === 'CONTENT-SECURITY-POLICY') || (name === 'X-WEBKIT-CSP');
    };
    return function({details:{responseHeaders: headers}}) {
        for (header of headers) {
            if ( isCSP(header) ) {
                for (type of types) {
                    header.value = header.value.replace(type, `${type}${new_domain}`);
                }
            }
        }
        return {
            responseHeaders: headers
        };
    }
};

let codesyAppender;

({hasListener, removeListener, addListener} = chrome.webRequest.onHeadersReceived)

const addCodesy = function(new_domain) {
    // if (hasListener(codesyAppender)) {
    //     removeListener(codesyAppender);
    // }
    codesyAppender = new makeCspAppender(new_domain);
    return addListener(codesyAppender, githubFilter, ["responseHeaders", "blocking"]);
};

({local: {get: getStorage},onChanged:{addListener: addStorageListener}} = chrome.storage)

getStorage(null,
    function ({domain}) {
        return addCodesy(domain)
    }
);

// addStorageListener(
//     function({domain:{newValue}}, namespace) {
//         if (newValue) { return addCodesy(newValue); }
//     }
// );
