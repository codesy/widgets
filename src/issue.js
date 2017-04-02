console.time('codesy issue load');

const make_widget = ({domain}) => {
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

        const add_link = (attr) => {
            attr.href = chrome.extension.getURL("css/iframe.css")
            return attr
        }
        $("head").append($('<link>').attr(add_link(codesy.css.attr)));
        const endtimer = ()=> console.timeEnd('codesy append iframe');
        const add_src = (url, attr)=> {
            attr.src = `${domain}/bid-status/?${$.param({url})}`
            return attr
        }
        $iframe  = (new_url) => $('<iframe>').attr(add_src(new_url, codesy.iframe.attr))
        const add = (new_url) => {
            console.time('codesy append iframe');
            $('body').append($iframe(new_url)).ready(add_link).ready(endtimer)
        }
        const remove = ()=> $(`#${codesy.iframe.attr.id}`).remove();
        resolve( { url:'', add, remove })
    })
}

const is_issue = (url)=>/https:\/\/github.com\/.*\/issues\/[1-9]+/g.test(url)

const watch_the_href = (widget) => {
    return new Promise((resolve)=>{
        const watch = (url) => {
            if (window.location.href !== widget.url){
                widget.url = window.location.href
                widget.remove()
                if (is_issue(widget.url)) widget.add(widget.url);
            }
            window.setTimeout(watch, 600);
        }
        watch(window.location.href)
    });
};

const get_codesy_domain = () => {
    return new Promise((resolve)=>{
        chrome.storage.local.get(null, resolve)
        chrome.storage.onChanged.addListener(window.location.reload)
    });
}

get_codesy_domain()
    .then(make_widget)
        .then(watch_the_href)

console.timeEnd('codesy issue load');
