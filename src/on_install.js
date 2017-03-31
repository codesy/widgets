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

on_installation = ({reason})=> {
    find_these({ title: "*codesy.io*" })
        .then(reload_them)
            .then(()=>{
                if (reason === 'install'){
                    find_these({ url: "*://*.github.com/*" })
                        .then(reload_them)
                }
            })
}

chrome.runtime.onInstalled.addListener(on_installation);
