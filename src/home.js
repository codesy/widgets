console.log("codesy home page");

console.time("codesy home");

if ($(".installed").length > 0) {
    $(".install-step").hide();
    $(".installed").show();
}

codesy = {};

// if (isChrome) {
codesy.storeDomain = function(domain) {
    return chrome.storage.local.get(null,
        function(data) {
            data.domain = domain || "";
            return chrome.storage.local.set(data);
        }
    );
};


// } else {
//   codesy.storeDomain = function(domain) {
//     var message;
//     message = {
//       task: "setHome",
//       domain: domain
//     };
//     return chrome.runtime.sendMessage(message);
//   };
// }

codesy.storeDomain(window.location.origin);

console.timeEnd("codesy home");
