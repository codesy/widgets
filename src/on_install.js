function find_these (query) {
    return new Promise((resolve)=>{
        chrome.tabs.query(query, resolve);
    });
}

function wait_for (id, resolve) {
    let times_checked = 0;
    let timerID, load_status;
    const set_status = ({status}) =>load_status=status
    const check_until = (status) => {
        if (load_status === status || (times_checked += 1) > 150){
            window.clearTimeout(timerID)
            return resolve()
        }
        chrome.tabs.get(id, set_status)
        timerID = window.setTimeout(check_until, 100, status);
    }
    check_until ( 'complete' )
}

function reload (id) {
    return new Promise((resolve) => {
        chrome.tabs.reload(id)
        wait_for(id, resolve)
    });
}

function reload_them (tabs) {
    const reloads = tabs.map(({id})=>reload(id))
    return Promise.all(reloads)
}

function select_them (tabs) {
    tabs.map( ({id}) => chrome.tabs.update(id, {selected:true}) )
    return tabs
}

when_installed ({reason}) => {
    find_these({ title: "*codesy.io*" })
            .then(select_them)
                .then(reload_them)
                    .then(()=>{
                        find_these({ url: "*://*.github.com/*" })
                            .then(reload_them)
                    })
}

chrome.runtime.onInstalled.addListener(when_installed);
