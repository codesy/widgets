console.time('codesy issue load');

const make_widget = ([url,{domain}]) => {
    return new Promise((resolve)=>{


        const codesy = {
            css:
                {attr: {
                    rel: "stylesheet",
                    type: "text/css"
                }
            },
            iframe:
                { attr:{
                    id: "codesy_iframe",
                    style: "visibility: collapse;",
                    scrolling: "no",
                    seamless: "seamless"
                }
            }
        };

        codesy.css.attr.href = chrome.extension.getURL("css/iframe.css")
        codesy.iframe.attr.src = `${domain}/bid-status/?${$.param({url})}`

        const $iframe  = $('<iframe>').attr(codesy.iframe.attr)
        const $link = () => $("head").append($('<link>').attr(codesy.css.attr));
        const endtimer = () => console.timeEnd('codesy append iframe');

        console.time('codesy append iframe');
        $('body').append($iframe).ready($link).ready(endtimer)
        resolve( { url, id: codesy.iframe.attr.id } )
    })
}

const wait_for_issue = () => {
    const is_issue = (url)=>/https:\/\/github.com\/.*\/issues\/[1-9]+/g.test(url)
    function watch_for(resolve) {
        let url = window.location.href;
        if ( is_issue(url) ) return resolve(url)
        window.setTimeout(watch_for, 600, resolve);
    }
    return new Promise( (resolve) => {
        watch_for(resolve);
    })
};

const watch_href = ({url, id}) => {
    const remove = () => $(`#${id}`).remove();
    return new Promise( (resolve) => {
        function wait() {
            if (window.location.href != url) {
                remove();
                return resolve();
            };
            window.setTimeout(wait, 600);
        }
        wait();
    })
};

const get_codesy_domain = () => {
    return new Promise((resolve)=>{
        chrome.storage.local.get(null, resolve)
    });
}

const domain = get_codesy_domain()

function widget_promise_chain(){
    const issue_page = wait_for_issue()
    Promise.all([issue_page,domain])
        .then(make_widget)
            .then(watch_href)
                .then(widget_promise_chain)
}
widget_promise_chain()

page_reload = () => window.location.reload(true);
on_domain_change = () => {
    return new Promise((resolve)=>{
        chrome.storage.onChanged.addListener(resolve)
    });
}
on_domain_change().then(page_reload)

console.timeEnd('codesy issue load');
