
githubFilter = {
    urls: ["https://github.com/*"],
    types: ["main_frame"]
};

headerOptions = ["responseHeaders", "blocking"]

const makeCspAppender = function(domain='') {
    const types = 'connect-src child-src script-src style-src';
    const isType = (word) => types.indexOf(word) !== -1;
    const isCSP = function (name) {
        name = name.toUpperCase()
        return (name === 'CONTENT-SECURITY-POLICY') || (name === 'X-WEBKIT-CSP');
    };
    return function({responseHeaders: headers}) {
        console.time('codesy map headers');
        const responseHeaders = headers.map(function({name, value}){
            if ( isCSP(name) ) {
                value = value.split(' ').reduce(
                    (accum, word)=>{
                        return `${accum} ${word} ${isType(word) ? domain : '' }`
                    },'')
            }
            return {name,value}
        })
        console.timeEnd('codesy map headers');
        return {responseHeaders};
    }
};

let codesyAppender = new makeCspAppender()

const setCodesyAppender = function(domain) {
    if (chrome.webRequest.onHeadersReceived.hasListener(codesyAppender)) {
        chrome.webRequest.onHeadersReceived.removeListener(codesyAppender);
    }
    codesyAppender = new makeCspAppender(domain);
    chrome.webRequest.onHeadersReceived.addListener(
        codesyAppender, githubFilter, headerOptions
    );
};

chrome.storage.local.get(null,
    ({domain})=>{
        if (domain) setCodesyAppender(domain);
    }
);

chrome.storage.onChanged.addListener(
    ({domain: {newValue: domain} }, namespace)=>{
        if (domain) setCodesyAppender(domain);
    }
);