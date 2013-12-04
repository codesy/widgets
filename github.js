// Send a request to codesy.io with the URL
// Add a new widget under div.discussion-labels showing:
// * Whether the bug has any bids in codesy
// * An offer input, filled with user's existing bid if applicable
// * An ask input, filled with user's existing bid if applicable
chrome.storage.local.get(function(options){
  var codesyImgUrl = chrome.extension.getURL("img/codesy-100x27.png"),
      codesyDomain = options.domain;

  var html = '<hr/>' +
      '<div id="codesy-widget">' +
      '<a href="http://codesy.io" target="_new"><img src="' + codesyImgUrl + '"/></a>' +
      '<form id="codesy" action="https://' + codesyDomain + '/bids" method="POST">' +
      '<input type="text" placeholder="offer amount" id="bid_offer" name="bid[offer]"/><br/>' +
      '<input type="text" placeholder="ask amount" id="bid_ask" name="bid[ask]"/><br/>' +
      '<a class="button minibutton">Bid</a>' +
      '</div>';
  $(".discussion-sidebar").append(html);
  $form = $("form#codesy");
  $form.find("a.button").click(function(){
    $form.submit();
  });
  var bid = $.getJSON('//' + codesyDomain + '/api/v1/bids.json?url=' + window.location);
});
