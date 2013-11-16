// Send a request to codesy.io with the URL
// Add a new widget under div.discussion-labels showing:
// * Whether the bug has any bids in codesy
// * An offer input, filled with user's existing bid if applicable
// * An ask input, filled with user's existing bid if applicable
var codesyImgUrl = chrome.extension.getURL("img/codesy-100x27.png");
$(".discussion-sidebar").append('<img src="' + codesyImgUrl + '"/>');

/*
xhr.open("GET", "https://codesy.io/bids?url=" window.location);
xhr.onreadystatechange = function() {
  alert("got bids back from codesy: " + xhr.responseText);
}
*/
