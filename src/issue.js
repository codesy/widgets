console.time('codesy issue load');

function make_widget_appender (domain) {
    const iframe_attr = {
                id: "codesy_iframe",
                style: "visibility: collapse;",
                scrolling: "no",
                seamless: "seamless",
            }
    const $iframe = (url) => {
        iframe_attr.src = `${domain}/bid-status/?${$.param({url})}`
        return $('<iframe>').attr(iframe_attr)
    }
    const css_attr = {
                rel: "stylesheet",
                type: "text/css",
                href: chrome.extension.getURL("css/iframe.css")
            }
    const $link = $('<link>').attr(css_attr);
    const append_link = () => $("head").append($link);
    const endtimer = () => console.timeEnd('codesy append iframe');

    return (url) => {
        console.time('codesy append iframe');
        $('body').append($iframe(url)).ready(append_link).ready(endtimer)
        return ( { url, id: iframe_attr.id } )
    }
}

function wait_for_issue_page () {
    const issue_rx = /https:\/\/github.com\/.*\/issues\/[1-9]+/
    function watch_for_issue(resolve) {
        let url = window.location.href;
        if ( issue_rx.test(url) ) return resolve(url)
        window.setTimeout(watch_for_issue, 400, resolve);
    }
    return new Promise( (resolve) => {
        watch_for_issue(resolve);
    })
};

function wait_for_page_change  ( {url, id} ) {
    function watch_href(resolve) {
        if (window.location.href != url) {
             $(`#${id}`).remove();
            return resolve();
        };
        window.setTimeout(watch_href, 400, resolve);
    }
    return new Promise( (resolve) => {
        watch_href(resolve);
    })
};

function get_codesy_domain () {
    return new Promise((resolve) => {
        const resolve_domain = ({domain = "https://www.codesy.io"}) => resolve(domain)
        chrome.storage.local.get(null, resolve_domain)
    });
}
const prepare_widget = get_codesy_domain().then(make_widget_appender)
const append_widget = ( [appender, url] ) => appender(url);

function on_github_pages(){
    Promise.all( [prepare_widget, wait_for_issue_page()] )
        .then(append_widget)
            .then(wait_for_page_change)
                .then(on_github_pages)
}
on_github_pages()

page_reload = () => window.location.reload(true);
chrome.storage.onChanged.addListener(page_reload)

console.timeEnd('codesy issue load');
