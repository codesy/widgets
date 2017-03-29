console.time('codesy issue load');
console.time('codesy issue to iframe');

const codesy = {
    href: "",
    rx: /https:\/\/github.com\/.*\/issues\/[1-9]+/g,
    css: {
        attr: {
            rel: "stylesheet",
            type: "text/css",
            href: chrome.extension.getURL("css/iframe.css")
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

codesy.make_iframe_attr = ({attr})=>{
    return (url)=>{
        attr.src =`${codesy.domain}/bid-status/?${$.param({url})}`
        return attr
    }
}
codesy.iframe_attr = codesy.make_iframe_attr(codesy.iframe)
codesy.$iframe = (url)=>$('<iframe>').attr(codesy.iframe_attr(url))
codesy.$link = ()=> $("head").append($('<link>').attr(codesy.css.attr));
codesy.endtimer = ()=> console.timeEnd('codesy append iframe');

codesy.addWidget = function(url) {
    console.time('codesy append iframe');
    $('body').append(codesy.$iframe(url)).ready(codesy.$link).ready(codesy.endtimer)
    return 400
};

codesy.make_rx_test = ({rx})=> (url) => rx.test(url)

codesy.rx_test = codesy.make_rx_test(codesy)

function watch_href (href='', waitime=400) {
    if (watch_href.href !== href) {
        watch_href.href = href;
        console.log("codesy: url changed");
        $(`#${codesy.iframe.attr.id}`).remove();
        if (codesy.rx_test(href)) codesy.addWidget(href);
    }
    codesy.timerID = window.setTimeout(watch_href, waitime, window.location.href);
};

codesy.setDomain = ({domain})=>{
    if (codesy.timerID) window.clearTimeout(codesy.timerID);
    codesy.domain = domain
    watch_href()
}

// get the current codesy domain and start listening for changes
chrome.storage.local.get(null, codesy.setDomain)
chrome.storage.onChanged.addListener(codesy.setDomain)

console.timeEnd('codesy issue load');
