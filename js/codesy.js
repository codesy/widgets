"use strict";
var codesy_api = (function (){
  var options = {
    endpoint: '/api',
    version: '/v1',
    domain: 'codesy-dev.herokuapp.com'
  };

  //generic call
  var call_api = function(resource, ajax_params) {
    ajax_params = ajax_params || {};
    return $.ajax({
      type: "get",
      url: "https://" + options.domain + options.endpoint + options.version+resource,
      data: ajax_params,
      dataType: 'json',
    })
  };

  function API(domain){
    options.domain = domain || options.domain;
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
  
  return API;

}());


