
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

codesy.watchURL = function() {
    if (codesy.href !== window.location.href) {
        console.log("codesy: url changed");
        codesy.href = window.location.href;
        codesy.newpage(window.location.href);
    }
    codesy.timerID = window.setTimeout(codesy.watchURL, 600);
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
    if (codesy.timerID){ window.clearTimeout(codesy.timerID) }
    codesy.$iframe = codesy.iframeElementMaker(domain)
    codesy.href = ''
    codesy.watchURL()
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


// get the current codesy domain and start listening for changes
chrome.storage.local.get(null, codesy.setIframe)

chrome.storage.onChanged.addListener(codesy.setIframe)




window.onpopstate = function() {
    console.log("codesy: popstate");
    codesy.newpage(window.location.href)
};

console.timeEnd('codesy issue load');
