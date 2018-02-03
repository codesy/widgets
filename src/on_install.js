function find_these (query) {
    return new Promise((resolve)=>{
        if (Object.keys(query).includes('title')) {
            // this is necessary until FF tab.title search works like Chrome
            chrome.tabs.query({}, (all_tabs)=>{
                tabs = all_tabs.filter(tab=>tab.title.includes(query.title))
                resolve(tabs)
            });
        } else {
            return chrome.tabs.query(query, resolve);
        }
    });
}

function wait_for (tab, resolve) {
    let times_checked = 0;
    let timerID, load_status;
    const set_status = ({status}) =>load_status=status
    const check_until = (status) => {
        if (load_status === status || (times_checked += 1) > 150){
            window.clearTimeout(timerID)
            return resolve(tab)
        }
        chrome.tabs.get(tab.id, set_status)
        timerID = window.setTimeout(check_until, 100, status);
    }
    check_until ( 'complete' )
}

function reload (tab) {
    return new Promise((resolve) => {
        chrome.tabs.reload(tab.id)
        wait_for(tab, resolve)
    });
}

function reload_them (tabs) {
    const reloaded = tabs.map((tab)=>reload(tab))
    return Promise.all(reloaded)
}

function activate_them (tabs) {
    activated = tabs.map( (tab)=>chrome.tabs.update(tab.id,{'active': true}) )
    return Promise.all(activated)
}

function when_installed ({reason}) {
    find_these( {title:"codesy.io"} )
        .then(reload_them)
            .then(activate_them)
                .then(()=>{
                    find_these( {url: "*://*.github.com/*"} )
                        .then(reload_them)
                })
}

chrome.runtime.onInstalled.addListener(when_installed);
