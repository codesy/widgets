console.log('launch.js');

$(document).ready(function() {
  console.log('launch doc change');
  return $(window).trigger('docchange');
});
