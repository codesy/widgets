function makeCspAppender (domain='') {
    const csp_names = ['CONTENT-SECURITY-POLICY','X-WEBKIT-CSP']
    const name_finder = (name) => (csp_name) => csp_name === name.toUpperCase()
    const if_csp = (name) => csp_names.find(name_finder(name)) ? true : false

    const codesy_types = 'connect-src frame-src child-src script-src style-src';
    const is_codesy = (type) => codesy_types.indexOf(type) !== -1;
    const add_codesy = (accum, word) =>`${accum} ${word} ${is_codesy(word) ? domain : '' }`;
    const insert_domain = (csp) => csp.split(' ').reduce(add_codesy,'');

    return function({responseHeaders: headers}) {
        console.time('codesy map headers');
        const responseHeaders = headers.map(function({name, value: original}){
            const value = if_csp(name) ? insert_domain(original) : original
            return {name,value}
        })
        console.timeEnd('codesy map headers');
        return {responseHeaders};
    }
};

let codesyAppender = new makeCspAppender()

const githubFilter = {
    urls: ["*://*.github.com/*"],
    types: ["main_frame"]
};

const headerOptions = ["responseHeaders", "blocking"]

function setCodesyAppender (domain) {
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
