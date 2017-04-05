console.time("load codesy home");

if ($(".installed").length > 0) {
    $(".install-step").hide();
    $(".installed").show();
}

codesy = {};

codesy.storeDomain = function(domain) {
    return chrome.storage.local.get(null,
        function(data) {
            data.domain = domain || "";
            return chrome.storage.local.set(data);
        }
    );
};

codesy.storeDomain(window.location.origin);

console.timeEnd("load codesy home");
