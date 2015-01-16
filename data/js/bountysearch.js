$(document).ready(function() {
  test();
});
//no need for ay of this code

function test() {
	
	console.log('you hit the New one!!')
	var $button = '<button type="button" id= "addbounty">Test</button>';
    var $label    = $('<label id="' + 'current-bounty' + '-label" for="' + 'current-bounty' + '" class="octosplit-label">' + '<strong>' + 'Current Bounty: ' + $currency + $currBounty + '</strong></label>' + $button);
	$('.issues-listing .gh-header-number').after($label);
}