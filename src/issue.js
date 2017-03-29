console.time('codesy issue load');
const codesy = {
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

$iframe  = (url)=>$('<iframe>').attr(set_bid_url(url))
$link    = ()=> $("head").append($('<link>').attr(codesy.css.attr));
endtimer = ()=> console.timeEnd('codesy append iframe');
add_widget = function(url) {
    console.time('codesy append iframe');
    $('body').append($iframe(url)).ready($link).ready(endtimer)
    return 400
};

github_test = (url)=>/https:\/\/github.com\/.*\/issues\/[1-9]+/g.test(url)

function watch_href (href='', wait=400) {
    if (watch_href.timerID) window.clearTimeout(watch_href.timerID);
    if (watch_href.href !== href) {
        watch_href.href = href;
        $(`#${codesy.iframe.attr.id}`).remove();
        if (github_test(href)) add_widget(href);
    }
    watch_href.timerID = window.setTimeout(watch_href, wait, window.location.href);
};

const set_iframe_domain = (domain, attr)=>{
    return (url)=>{
        attr.src =`${domain}/bid-status/?${$.param({url})}`
        return attr
    }
}

let set_bid_url;
set_domain = ({domain})=>{
    set_bid_url = set_iframe_domain(domain, codesy.iframe.attr)
    watch_href()
}
set_domain_reload = ({domain})=>{
    window.location.reload(true);
    set_domain({doman})
}
// get the current codesy domain and start listening for changes
chrome.storage.local.get(null, set_domain)
chrome.storage.onChanged.addListener(set_domain_reload)

console.timeEnd('codesy issue load');
