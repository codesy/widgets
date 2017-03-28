console.time('codesy issue load');

const codesy = {
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
        codesy.newpage();
    }
    codesy.timerID = window.setTimeout(codesy.watchURL, 600);
};

codesy.$iframe = ()=>$('<iframe>').attr(codesy.iframe.attr)

codesy.loadcss = function() {
    console.log("codesy newpage: iFrame loaded");
    codesy.css.attr.href = chrome.extension.getURL("css/iframe.css");
    $("head").append($('<link>').attr(codesy.css.attr));
    console.timeEnd('codesy insert iframe');
};

codesy.newpage = function() {
    ({ href: url, domain, rx, iframe: {attr}} = codesy)
    $(`#${attr.id}`).remove();
    if (rx.test(url)) {
        console.time('codesy insert iframe');
        codesy.iframe.attr.src = `${domain}/bid-status/?${$.param({url})}`;
        $('body').append(codesy.$iframe()).ready(codesy.loadcss)
    } else {
        return console.log("codesy newpage: not an issue");
    }
};

codesy.setDomain = ({domain})=>{
    if (codesy.timerID){ window.clearTimeout(codesy.timerID) }
    codesy.domain = domain
    codesy.href = ''
    codesy.watchURL()
}

// get the current codesy domain and start listening for changes
chrome.storage.local.get(null, codesy.setDomain)
chrome.storage.onChanged.addListener(codesy.setDomain)

console.timeEnd('codesy issue load');
