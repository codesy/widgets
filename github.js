// Send a request to codesy.io with the URL
// Add a new widget under div.discussion-labels showing:
// * Whether the bug has any bids in codesy
// * An offer input, filled with user's existing bid if applicable
// * An ask input, filled with user's existing bid if applicable

chrome.storage.local.get(function(options){
  var codesyImgUrl = chrome.extension.getURL("img/codesy-100x27.png"),
      codesyDomain = options.domain;

  $.ajax({
    url: "https://" + codesyDomain + "/api/v1/csrf_token.json"
  }).done(function(data) {
    console.log("$.ajax successful.");
    console.log(data);

    appendForm(codesyImgUrl, codesyDomain, data.csrf_token);
  }).fail(function(data) {
    console.log("$.ajax failed.");
    console.log(data);
  });

});
var appendForm = function(codesyImgUrl, codesyDomain, csrfToken) {
  var html = '<hr/>' +
        '<div id="codesy-widget">' +
        '<a href="http://codesy.io" target="_new"><img src="' + codesyImgUrl + '"/></a>' +
        '<form id="codesy" action="https://' + codesyDomain + '/bids"' + ' method="POST">' +
        '<input name="authenticity_token" type="hidden" value="' + csrfToken + '" />' +
        '<input type="hidden" name="bid[url]" value="' + window.location + '" />' +
        '<input type="text" placeholder="offer amount" id="bid_offer" name="bid[offer]"/><br/>' +
        '<input type="text" placeholder="ask amount" id="bid_ask" name="bid[ask]"/><br/>' +
        '<a class="button minibutton">Bid</a>' +
        '</div>';
  $(".discussion-sidebar").append(html);
  $form = $("form#codesy");
  $form.find("a.button").click(function(){
    $form.submit();
  });
  var bid = $.getJSON('//' + codesyDomain + '/api/v1/bids.json?url='
                      + window.location);
};
