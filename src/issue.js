
console.time('codesy issue load');

const codesy = {
    domain: "https://codesy.io",
    href: "",
    rx: /https:\/\/github.com\/.*\/issues\/[1-9]+/g,
    css: {
        attr: {
            rel: "stylesheet",
            type: "text/css",
            href: ""
        }
    },
    iframe: {
        attr: {
            id: "codesy_iframe",
            style: "visibility: collapse;",
            scrolling: "no",
            seamless: "seamless"
        }
    }
};

codesy.iframeElementMaker = function(url=[codesy.domain]) {
    return function (){
        codesy.iframe.attr.src = `${url}/bid-status/?${$.param({url})}`
        return $('<iframe>').attr(codesy.iframe.attr)
    }
}

// set default iframe
codesy.$iframe = codesy.iframeElementMaker()

codesy.setIframe = ({domain})=>{
    codesy.$iframe = codesy.iframeElementMaker(domain)
}

codesy.loadcss = function() {
    console.log("codesy newpage: iFrame loaded");
    codesy.css.attr.href = chrome.extension.getURL("css/iframe.css");
    $("head").append($('<link>').attr(codesy.css.attr));
};

codesy.newpage = function(new_url) {
    ({ rx, iframe: {attr}} = codesy)
    $(`#${attr.id}`).remove();
    if (rx.test(new_url)) {
        $('body').append(codesy.$iframe()).ready(codesy.loadcss)
    } else {
        return console.log("codesy newpage: not an issue");
    }
};

codesy.watchURL = function() {
    if (codesy.href !== window.location.href) {
        console.log("codesy: url changed");
        codesy.href = window.location.href;
        codesy.newpage(window.location.href);
    }
    return window.setTimeout(codesy.watchURL, 600);
};

//start watching

// get the current codesy domain and start listening for changes
chrome.storage.local.get(null, codesy.setIframe)
chrome.storage.onChanged.addListener(codesy.setIframe)


codesy.watchURL();


window.onpopstate = function() {
    console.log("codesy: popstate");
    codesy.newpage(window.location.href)
};

console.timeEnd('codesy issue load');
