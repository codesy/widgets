# We evaluate every new url/page

console.log 'launch.js'

$(document).ready ->
  console.log 'launch doc change'
  $(window).trigger 'docchange'
  

