const find_these = (query)=>{
    return new Promise((resolve)=>{
        chrome.tabs.query(query, resolve);
    });
}

const loading = (id, resolve)=>{
    if (loading.status === 'complete'){
        window.clearTimeout(loading.timerID)
        return resolve()
    }
    chrome.tabs.get(id,({status})=>{loading.status=status})
    loading.timerID = window.setTimeout(loading, 200, id, resolve);
}

const reload = (id)=>{
    return new Promise((resolve)=>{
        chrome.tabs.reload(id)
        loading(id, resolve)
    });
}

const reload_them = (tabs)=> {
    const reloads = tabs.map(({id})=>reload(id))
    return Promise.all(reloads)
}

const  selected = (id)=>{
    return new Promise((resolve)=>{
        chrome.tabs.update(id, {selected:true}, resolve)
    });
}

const select_them = (tabs)=> {
    const reloads = tabs.map(({id})=> selected(id))
    return Promise.all(reloads)
    return tabs
}

when_installed = ({reason})=> {
    find_these({ title: "*codesy.io*" })
            .then(select_them)
                .then(reload_them)
                    .then(()=>{
                        find_these({ title: "*codesy.io*" })
                        if (reason === 'install'){
                            find_these({ url: "*://*.github.com/*" })
                                .then(reload_them)
                        }
                })
}

chrome.runtime.onInstalled.addListener(when_installed);
