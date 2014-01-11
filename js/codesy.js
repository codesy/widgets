"use strict";

var codesy={};

(function (cdsy){
  var pages = [
    { domain:/.github.com/i,
      target:{selector:'.discussion-sidebar'},
      before_append:function(){},
      after_append:function(){}
    },
    { domain:/.bitbucket.org/i,
      target:{selector:'dl.issue-attrs',
              containers: ['<div class="issue-attr">']  }
    },
    { domain:/.sourceforge.net/i,
      target:{selector:'#sidebar',
            containers:['<li>','<ul class="sidebarmenu">']            
          }                  
    },
    { domain:/.stackoverflow.com/i,
      target:{selector:'#sidebar'
          }                  
    }
  ]
  
  cdsy.options = {
    endpoint: '/api',
    version: '/v1',
    domain: 'codesy-dev.herokuapp.com'
  }


  cdsy.appendForm = function(mission,codesyImgUrl, csrfToken) {
    var dfd = new $.Deferred(),
    
    $codesy_link = $('<a href="http://codesy.io" target="_new"><img src="' + codesyImgUrl + '"/></a>' ),

    $codesy_form = $('<form>'),  

    $submit_button = $('<button>')
      .attr('class','button minibutton')
      .text('Bid')
      .click(function(){$codesy_form.submit();});

    $codesy_form
      .attr('id', 'codesy')
      .attr('action', 'https://' + cdsy.options.domain + '/bids')
      .attr('method', 'POST')
      .append('<input name="authenticity_token" type="hidden" value="' + csrfToken + '" />')
      .append('<input type="hidden" name="bid[url]" value="' + window.location + '" />')
      .append('<input type="text" placeholder="offer amount" id="bid_offer" name="bid[offer]"/><br/>')
      .append('<input type="text" placeholder="ask amount" id="bid_ask" name="bid[ask]"/><br/>')
      .append($submit_button);

    var $codesy_widget = $('<div id="codesy-widget" >')
      .append('<hr/>')
      .append($codesy_link)
      .append($codesy_form);

    if(mission.target.containers){
      mission.target.containers.forEach(function(elem){
        $codesy_widget = $(elem).append($codesy_widget)
      })
    } 

    $(mission.target.selector).first()
      .append($codesy_widget)


    if($('#codesy-widget').length > 0){
      dfd.resolve()
    } else {
      dfd.reject()
    }

    return dfd.promise()
  }

  cdsy.match = function(location){
    var dfd = new $.Deferred(),
    url = location.toString() || dfd.reject('No url defined') 
    
    pages.forEach(function(page){
      page.domain.test(url) & $(page.target.selector).length >0 && dfd.resolve(page);
    })

    return dfd.promise();
  }

  //generic call
  var call_api = function(resource, ajax_params) {
    ajax_params = ajax_params || {};
    return $.ajax({
      type: "get",
      url: "https://" + cdsy.options.domain + cdsy.options.endpoint + cdsy.options.version+resource,
      data: ajax_params,
      dataType: 'json'
    })
  };

  function API(domain){
    cdsy.options.domain = domain || cdsy.options.domain;
    var call_map = [
      ['csrf_token','/csrf_token.json'],
      ['bids', '/bids.json']
    ];
    call_map.forEach(function(value) {
      this.prototype[value[0]] = function(params) {
        return call_api(value[1], params)
      }
    },API);

  }  
  
  cdsy.api = new API;

}(codesy));


