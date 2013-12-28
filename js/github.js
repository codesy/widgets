// Send a request to codesy.io with the URL
// Add a new widget under div.discussion-labels showing:
// * Whether the bug has any bids in codesy
// * An offer input, filled with user's existing bid if applicable
// * An ask input, filled with user's existing bid if applicable

chrome.storage.local.get(function(options){
  var codesyImgUrl = chrome.extension.getURL("img/codesy-100x27.png"),
      codesyDomain = options.domain;
      
  codesy = new codesy_api(codesyDomain);

  codesy.csrf_token().done(function(data) {
    console.log("$.ajax successful.");
    console.log(data);

    appendForm(codesyImgUrl, codesyDomain, data.csrf_token);
  }).fail(function(data) {
    console.log("$.ajax failed.");
    console.log(data);
  });

});

var appendForm = function(codesyImgUrl, codesyDomain, csrfToken) {
  var $codesy_link = $('<a href="http://codesy.io" target="_new"><img src="' + codesyImgUrl + '"/></a>' ),
  $codesy_form = $('<form>'),  
  $submit_button = $('<button>')
    .attr('class','button minibutton')
    .text('Bid')
    .click(function(){$codesy_form.submit();});

  $codesy_form 
    .attr('id','codesy')
    .attr('action','https://' + codesyDomain + '/bids' )
    .attr('method','POST')
    .append('<input name="authenticity_token" type="hidden" value="' + csrfToken + '" />')
    .append('<input type="hidden" name="bid[url]" value="' + window.location + '" />')  
    .append('<input type="text" placeholder="offer amount" id="bid_offer" name="bid[offer]"/><br/>')
    .append('<input type="text" placeholder="ask amount" id="bid_ask" name="bid[ask]"/><br/>')
    .append($submit_button),


  $(".discussion-sidebar")
    .append('<hr/>')
    .append('<div>')
        .attr('id','codesy-widget')
        .append($codesy_link)
        .append($codesy_form)
        
  var bid = $.getJSON('//' + codesyDomain + '/api/v1/bids.json?url=' + window.location);

};
