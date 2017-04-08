console.time('codesy issue load');

const make_widget = ( {domain} ) => {
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
    const $iframe = () => $('<iframe>').attr(codesy.iframe.attr)
    codesy.css.attr.href = chrome.extension.getURL("css/iframe.css");
    const $link = $('<link>').attr(codesy.css.attr);
    const add_link = () => $("head").append($link)
    const endtimer = () => console.timeEnd('codesy append iframe');

    return (url) => {
        codesy.iframe.attr.src = `${domain}/bid-status/?${$.param({url})}`
        console.time('codesy append iframe');
        $('body').append($iframe).ready(add_link).ready(endtimer)
        return ( { url, id: codesy.iframe.attr.id } )
    }
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

const wait_for_change = ( {url, id} ) => {
    return new Promise( (resolve) => {
        function wait() {
            if (window.location.href != url) {
                 $(`#${id}`).remove();
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
const prepare_widget = get_codesy_domain().then((domain)=>make_widget(domain))
const add_widget = ( [maker, url] ) => maker(url);

function on_github_pages(){
    Promise.all([prepare_widget, wait_for_issue()])
        .then(add_widget)
            .then(wait_for_change)
                .then(on_github_pages)
}
on_github_pages()

page_reload = () => window.location.reload(true);
chrome.storage.onChanged.addListener(page_reload)

console.timeEnd('codesy issue load');
