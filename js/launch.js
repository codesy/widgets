// We evaluate every new url/page

// Look for a widget to add to this page
codesy.match(window.location)

//After a successful match, receive the mission to add the widget to this page    
  .done(function(mission){    

// See if we can get a csrf_token from the preferred codesy server
    codesy.api.csrf_token()
      .done(function(data) {

        console.log("$.ajax successful.");
        var codesyToken = data.csrf_token;
        console.log(data);
// see if the HTML element for this domain exists    
        if($(mission.target_selector)){

// get the extension user options
          chrome.storage.local.get(function(options){

// run custom function before changing the DOM
            mission.before_append && mission.before_append (options);
            var codesyImgUrl = chrome.extension.getURL("img/codesy-100x27.png"),
                codesyDomain = options.domain;
  
            codesy.appendForm(mission,codesyImgUrl, codesyDomain, codesyToken)
  
              .done(function(){
//TODO : update the widget with any bid information                 
                var bid = codesy.bids({url:window.location.toString()});
                console.log(bid)

// run custom function after successfully changing the DOM
                mission.after_append && mission.after_append

              })
          });
        }    
      })
      .fail(function(data) {
        console.log("$.ajax failed.");
        console.log(data);
      });


  });









