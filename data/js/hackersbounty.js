
//ok this is where everything is. 
$(document).ready(function() {
	
	//github makes it hard to overlay content on top, so these timers and location.href checks make sure that the buttons and search page overlay on github both 
	//on page refresh, and navigating to that page from another github page.
	if(location.href == "https://github.com/explore")
	{
	    this.oldHash = window.location.hash;
	       this.Check;

	       var that = this;
	       var detect = function(){
	           if(that.oldHash!=window.location.hash){
	               location.reload();
	               that.oldHash = window.location.hash;
	           }
	       };
	       this.Check = setInterval(function(){ detect() }, 100);
	}


//search page
	if(location.href.indexOf("https://github.com/explore#bountysearch") > -1) {
		
   //timer for search. if the search page number changes, redraw it
		var oldLocation = location.href;
   	 setInterval(function() {
		//every time new search page clicked
      if(location.href != oldLocation) {
        
		  //get
		  var page_number = getSecondPart(location.href);
		  
		 //redraw the page
		remove("table1");
		remove("middle");
		var codes = numPages();
		showSearchResults(codes[0], page_number);
	  }
		oldLocation = location.href;
	  
   		 console.log('hao');
   	  }, 100);
		
	  var page_number = getSecondPart(location.href);
		
		showSearchOptionsButton();
		var codes = numPages();
		showSearchResults(codes[0],page_number );
	   //5 Detect option change
		document.getElementById("options").addEventListener("change", function(){
			
  		  var page_number = getSecondPart(location.href);

				console.log('changed option');
				//erase old view
				remove("table1");
				remove("middle");
				var codes = numPages();
				showSearchResults(codes[0], page_number);
			

			});
		
	}
	


	
//timer- every page - search button and buttons on issue page 
	
	
	//on every page, check if its a new page. If it is a new page and it is an issues page, show the bounty.
	var oldLocation = location.href;
	 setInterval(function() {
	      if(location.href != oldLocation) {
			  console.log('yo');
			  if(document.URL.indexOf("/issues/") > -1)
			    	{
					
					    if ($('#addbounty').length){
							
							location.reload();
							
					      }
						  else {
  				  		  	showBounty();
						  	
						  }
						
					
													
						console.log("SHOW!");
						console.log('matches');
					}
					oldLocation = location.href;
	      }
	  }, 1000);

	  showSearchButton();
	  if(document.URL.indexOf("/issues/") > -1) {
		console.log("SHOW2!");
		
		
		  
	  showBounty();
	  }
  
});


function numPages() {
	
	//this figures out how many pages we're going to need to show the search results assuming 10 results per page
	
    var currencyJSON = httpGet('https://www.havi.co/api/bounties/');
	var currencyObj = JSON.parse(currencyJSON);
	
	var lengthArr = new Array();
	
	for(var j = 0; j < currencyObj.bounties.length; j++)
	{
	
		if(currencyObj.bounties[j].amount == '0')
		{
			console.log('zero bounty');
		}
		else {
			lengthArr.push(currencyObj.bounties[j]);
			
			
		}
		
	}
	
	var num_bounties = lengthArr.length;
	//divide by results per page
	var num_pages = Math.floor(num_bounties/10);
	var num_on_last_page = num_bounties %10;
	if(num_on_last_page != 0) {
		
		num_pages+=1;
	}
	
	return [num_pages, num_on_last_page];
}

function getSecondPart(str) {
    return str.split('=')[1];
}


//shows bounty amount and button on issue 
function showBounty() {
	//console.log('you hit the OG!!')
	


  

	
	
    
	
	//call the api to display the curency amount
	
	//parse string and input it  TODO
	var url = document.URL;
    var split = url.split('/');
    var owner = split[3];
    var repo = split[4];
    var issueID = split[6];
  

	
var currencyJSON = httpGet('https://www.havi.co/api/bountyamount/' + repo + '/' + owner + '/' + issueID);
var currencyObj = JSON.parse(currencyJSON);

	
	//set vars
	var  $currBounty = (currencyObj.amount) /100;
	var  $currency = "$";
	
   
	
	//create buttons and labels
	var $test = '<a href="javascript:void(0)" class="minibutton" id= "addbounty">Add Money</a>'
	var $test2 = '<a href="javascript:void(0)" class="minibutton" id= "claimbounty">Claim Bounty</a>'
	//var $button = '<br><button type="button" id= "addbounty">Add Funds</button>';
    //var $button2 = '<button type="button" id= "claimbounty">Claim Bounty</button>';
	if($currBounty != 0) {
	    var $label    = '<br>' + $test2 + ' ' + $test + '<font face="helvetica" size="30px"><label id="' + 'current-bounty' + '-label" for="' + 'current-bounty' + '" class="octosplit-label"></font>' + '<font size="4px">' + $currency + $currBounty + ' Bounty ' + '</font></label>';
		
	}
	else {
		
	    var $label    = '<br>' + $test + '<font face="helvetica" size="30px"><label id="' + 'current-bounty' + '-label" for="' + 'current-bounty' + '" class="octosplit-label"></font>' + '<font size="4px">' + $currency + $currBounty + ' Bounty ' + '</font></label>';
		
	}
	$('.issues-listing .gh-header-number').after($label);
    document.getElementById("addbounty").addEventListener("click",paymentPopup);
   
 

	
	   
	   
      //place them on the page
   //	$('.issues-listing .gh-header-number').after($button2);
   
    
   	//why still together?
       document.getElementById("claimbounty").addEventListener("click",claimPopup);
	
   	
   
   
   
 
	
}

function showSearchButton() {

	var $button = '<button type="button" id= "bountysearch">Bounty Search</button>';

    // $('.container.clearfix .header-nav.left').append($button);
	 $(".container.clearfix .header-nav.left").append('<li class="header-nav-item"><a class="header-nav-link" href="/explore#bountysearch?pg=1" data-ga-click="(Logged out) Header, go to blog, text:blog">Bounties</a></li>');
	 $(".container.clearfix .header-nav.left").css("width", "320px");
	 
	 
   // document.getElementById("bountysearch").addEventListener('click',changeURL);
	 
	 

}

function changeURL() { 
	
    //1 Change URL 
	window.location.href = "https://github.com/explore#bountysearch?pg=1";

}


//payment popup
//1-web app payment page (stripe on site or )
function paymentPopup() {

 // setInterval(function() {
 // 	 console.log('lol');
 // 	onunload="window.opener.location = window.opener.location;"
 //
 //  }, 1000);
 var currencyJSON = httpGet('https://www.havi.co/api/userID/');
 var currencyObj = JSON.parse(currencyJSON);
 console.log('ha', currencyObj.hasCard);
 
 
var issueInfo = $(this).closest("#partial-discussion-header").attr("data-url");
 
 if(currencyObj.hasCard == 'YES')
 {
  	var win = window.open('https://www.havi.co/collectpaymentdata?issue='+issueInfo,'WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=250, height=300'); 
    console.log('first');
	var timer = setInterval(function() {   
	    if(win.closed) {  
	        clearInterval(timer);  
			console.log('bountytimer');
			location.reload(); 
	    }  
	}, 1000); 
 }
 else
 {
 	var win = window.open('https://www.havi.co/collectpaymentdata?issue='+issueInfo,'WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=400, height=520'); 
    console.log('first', win.location);
	var timer = setInterval(function() {   
	    if(win.closed) {  
	        clearInterval(timer);  
			console.log('bountytimer');
			location.reload(); 
	    }  
	}, 1000); 
 }
 
    
 return false;


}

function claimPopup() {
	var issueInfo = $(this).closest("#partial-discussion-header").attr("data-url");
	window.open('https://www.havi.co/collectclaimdata?issue='+issueInfo,'WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=275, height=400'); return false;
}


function showSearchOptionsButton() {
	
	var select = '<br><br><select class="button" id="options"><option value="highest"><i>Sort:</i> Highest Bounty</option><option value="newest"><font><i>Sort:</i></font> Newest Bounty</option></select>';
	
	document.getElementById("site-container").innerHTML = select;
}


function showSearchResults(num_pages, page_number) {
	console.log('gotosearch page called');
	
		
        var currencyJSON = httpGet('https://www.havi.co/api/bounties/');
  		var currencyObj = JSON.parse(currencyJSON);
		
		var lengthArr = new Array();
		
		for(var j = 0; j < currencyObj.bounties.length; j++)
		{
			//only shows bounties that are nonzero
			if(currencyObj.bounties[j].amount == '0')
			{
				console.log('zero bounty');
				   // currencyObj.bounties.splice(i, 1);
			}
			else {
				lengthArr.push(currencyObj.bounties[j]);
				
				
			}
			
		}
		
		console.log('the new array is this long', lengthArr.length);
		
		
		var title = JSON.parse(httpGet('https://api.github.com/repos/' + lengthArr[0].owner + '/' + lengthArr[0].repo +  '/issues/' + lengthArr[0].issueID)).title;
		console.log(title);
		//console.log(currencyObj.bounties[0]);
	    var githublink = 'https://github.com/';
		
//3 Sort data
		if(document.getElementById("options") != null) 
		{
	    var option = document.getElementById("options").value;
		console.log('the option is', option);
	    if(option == "highest"){
			currencyObj.bounties.sort(function(a,b) { 
				console.log('highest');
				return a.amount - b.amount } );
		}
	    if(option == "newest"){
			currencyObj.bounties.sort(function(a,b){
				console.log('newest');
			  return new Date(b.date) - new Date(a.date);
			});
		}
		
	   }
	   else {
	   	
		   console.log('no options tab');
		   //default as highest
		   currencyObj.bounties.sort(function(a,b) { return a.amount - b.amount } );
	   
	   }
	
	   console.log('async afterwards?');		
//4 Draw
    var num_rows = currencyObj.bounties.length;
    var num_cols = 1;
    var width = 100;
    var theader = "<table id='table1' width = ' "+ width +"% '>";
    var tbody = "";

    for(var j = 0; j < num_cols; j++)
    {
      theader += "<th id ='headertable'><b><font face='helvetica' size=3px><div align='left'>" + lengthArr.length+  " bounties found</div></font></b><br></th>";
    }
	var codes = numPages();
	var numpages = codes[0];
	var num_on_last_page = codes[1];
	console.log('numpages', numpages);
	console.log('num on last page', num_on_last_page);
	if(num_on_last_page == 0) {
		
		num_on_last_page+=10;
	}
	
	
	
	
	//last page logic 
	if(page_number ==  numpages.toString()) {
		
		console.log("last page!");
	    for(var i = num_rows - (1 + ((page_number-1)*10)) ; i >= num_rows-(((1 + ((page_number-1)*10))-1)+num_on_last_page); i--)
	    {
			//getdate
		    var timeDate = currencyObj.bounties[i].updatedAt;
			var string = timeDate.split("T");
			var date = string[0];
			var time = string[1];
	
			var splitagain = date.split("-");
			var year = splitagain[0];
			var month = splitagain[1];
			var day = splitagain[2] - 1;
	
			var dayth = ordinal_suffix_of(day);
			var final = finalparse(dayth);
			var monthNames = [ "January", "February", "March", "April", "May", "June",
			    "July", "August", "September", "October", "November", "December" ];
	
			
			
			
			if(currencyObj.bounties[i].amount != 0)
			{
		        tbody += "<tr>";
		            tbody += "<td>";
				    tbody += '<br><div id ="text" class="alignleft"><b><font size=3px face="Helvetica"><a href=' + githublink + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo + '/' + 'issues' + '/' + currencyObj.bounties[i].issueID + '>'+ JSON.parse(httpGet('https://api.github.com/repos/' + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo +  '/issues/' + currencyObj.bounties[i].issueID)).title  + '</a></font></b></div><div class="alignright"><font face="Helvetica">' + '#' +  currencyObj.bounties[i].issueID + '</font></div><br><br>'; 
					tbody +=  currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo ;
					tbody += '<div id="text"><p class="alignleft"><font size=3px color=green face="Helvetica"><b>' + '$' + currencyObj.bounties[i].amount/100  + '</b></font></p>' + ' ' + '<p class="alignright"><font size=3px color=black face="Helvetica">' + monthNames[parseInt(month)-1] + " " +dayth + ' ' + year +  '</font></p></div><br>';
					tbody += "</td>";
		        tbody += "</tr><br />";
			}
	    }
	}
	//all other page logic
	else {
		
		 var featured = true;
 		var current_page = window.location.href.slice(-1);
 		var page = parseInt(current_page);
	    for(var i = num_rows - (1 + ((page_number-1)*10)) ; i >= num_rows-(10 + ((page_number-1)*10)); i--)
	    {
			
			//getdate
		    var timeDate = currencyObj.bounties[i].updatedAt;
			var string = timeDate.split("T");
			var date = string[0];
			var time = string[1];
	
			var splitagain = date.split("-");
			var year = splitagain[0];
			var month = splitagain[1];
			var day = splitagain[2] -1 ;
	
			var dayth = ordinal_suffix_of(day);
			var final = finalparse(dayth);
			var monthNames = [ "January", "February", "March", "April", "May", "June",
			    "July", "August", "September", "October", "November", "December" ];
	
			
			
			
			if(currencyObj.bounties[i].amount != 0)
			{
				
				if(featured && page == 1)	
				{
			        tbody += "<tr>";
			            tbody += "<td>";
					    tbody += '<br> <div id ="text" class="alignleft"><b><font size=3px face="Helvetica"><a href=' + githublink + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo + '/' + 'issues' + '/' + currencyObj.bounties[i].issueID + '>'+ JSON.parse(httpGet('https://api.github.com/repos/' + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo +  '/issues/' + currencyObj.bounties[i].issueID)).title  + '</a><b>&nbsp;[Featured]</b></font></b></div><div class="alignright"><font face="Helvetica">' + '#' +  currencyObj.bounties[i].issueID + '</font></div><br><br>'; 
						tbody +=  currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo ;
						tbody += '<div id="text"><p class="alignleft"><font size=3px color=green face="Helvetica"><b>' + '$' + currencyObj.bounties[i].amount/100  + '</b></font></p>' + ' ' + '<p class="alignright"><font size=3px color=black face="Helvetica">' + monthNames[parseInt(month)-1] + " " +dayth + ' ' + year +  '</font></p></div><br>';
						tbody += "</td>";
			        tbody += "</tr><br />";
					
					featured =false;
					
				}
				else
				{
			        tbody += "<tr>";
			            tbody += "<td>";
					    tbody += '<br><div id ="text" class="alignleft"><b><font size=3px face="Helvetica"><a href=' + githublink + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo + '/' + 'issues' + '/' + currencyObj.bounties[i].issueID + '>'+ JSON.parse(httpGet('https://api.github.com/repos/' + currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo +  '/issues/' + currencyObj.bounties[i].issueID)).title  + '</a></font></b></div><div class="alignright"><font face="Helvetica">' + '#' +  currencyObj.bounties[i].issueID + '</font></div><br><br>'; 
						tbody +=  currencyObj.bounties[i].owner + '/' + currencyObj.bounties[i].repo ;
						tbody += '<div id="text"><p class="alignleft"><font size=3px color=green face="Helvetica"><b>' + '$' + currencyObj.bounties[i].amount/100  + '</b></font></p>' + ' ' + '<p class="alignright"><font size=3px color=black face="Helvetica">' + monthNames[parseInt(month)-1] + " " +dayth + ' ' + year +  '</font></p></div><br>';
						tbody += "</td>";
			        tbody += "</tr><br />";
					
				}
				
	       
			}
	    }
	}
	    var tfooter = "</table>";
    
	console.log('replacing html');

	var pagination_head = '<br><div id="makesmall" width="400px;"><div align="center" class="pagination"  id="middle">';
	var pagination_body = "";
	
			//pre-spacing
			pagination_body += '<a href="#bountysearch?pg='+ '"class="page gradient" style="pointer-events: none; cursor: default; visibility: hidden;">' + '&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp' + '</a>' 
	

	var current_page = window.location.href.slice(-1);
	var page = parseInt(current_page);
//if 5 pages or less, just print them out 
	if(num_pages <= 5){
		
		
		
		for(var x = 1; x <= num_pages; x++) {
			 
			if (x == page && num_pages != 1)
			{
				console.log('lol');
				pagination_body += '<a href="#bountysearch?pg=' +x+ '"class="current">' + x + '</a>'; 
				
			}
			else{
				console.log('num_pages was 1', num_pages);
				pagination_body += '<a href="#bountysearch?pg=' +x+ '"class="page gradient">' + x + '</a>' ;
			}
				

		}
		
		
	}
	
//if more than 5 pages
	if(num_pages > 5) {
		
			
		
		var current_page = window.location.href.slice(-1);
		var page = parseInt(current_page);
		
		// //[0] show first button
 		pagination_body += '<a href="#bountysearch?pg=' + 1 + '"class="page gradient">' + 'first' + '</a>'
//
//
		
		//[1] show previous button
		if(current_page != 1) {
		pagination_body += '<a href="#bountysearch?pg=' +(current_page-1)+ '"class="page gradient">' + 'previous' + '</a>'
			
		}
		else {
		pagination_body += '<a href="#bountysearch?pg=' +(current_page)+ '"class="page gradient">' + 'previous' + '</a>'
			
			
		}
		
		//[2] show the 5 dynamic pages
		 var remainder = num_pages-page; //so if 6 pages and at 2, remainder is 4
		 var back_remainder = 4-remainder;
		 
		 //if we have room to show the next 5 from the current page
		 if(page+4 <= num_pages)
		 {
		
			 for(var x = page; x <= page+4; x++ ) 
			 {
				 if(x == page)
				 {
			 	pagination_body += '<a href="#bountysearch?pg=' + x + '"class="current">' + x + '</a>'
				 	
				 }
				 else
				 {
			 	pagination_body += '<a href="#bountysearch?pg=' + x + '"class="page gradient">' + x + '</a>'
				 	
				 }
			 }
		 	
		 }
		 //if we dont
		 else {
		 	
			
			 for(var x = (page - back_remainder); x <= (page + remainder); x++ ) 
			 {
				 if( x == page) {
					 pagination_body += '<a href="#bountysearch?pg=' + x + '"class="current">' + x + '</a>';
				 	
				 }
				 else
				 {
					 pagination_body += '<a href="#bountysearch?pg=' + x + '"class="page gradient">' + x + '</a>';
				 }
				
			 }
		 }

      
		
		//[3] show next button
		if(current_page != num_pages)
		{
		pagination_body += '<a href="#bountysearch?pg=' +(page+1) + '"class="page gradient">' + 'next' + '</a>'
		}
		else
		{
		pagination_body += '<a href="#bountysearch?pg=' +(page)+ '"class="page gradient">' + 'next' + '</a>'
			
		}
		
		// //[4] show last button
 		pagination_body += '<a href="#bountysearch?pg=' + num_pages + '"class="page gradient">' + 'last' + '</a>'
//
		
		
	}
	
	//post-spacing
			pagination_body += '<a href="#bountysearch?pg='+ '"class="page gradient" style="pointer-events: none; cursor: default; visibility: hidden;" border-color="transparent">' + '&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp' + '</a>' 
	
			
	
	var pagination_footer = '</div></div>';
	
	$(theader + tbody + tfooter + pagination_head + pagination_body + pagination_footer).insertAfter("select");
	$('#options').nextUntil(':not(br)').remove();
			
}


//get date
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
	
    return i + "th";
}
function finalparse(i) {
	if(i.charAt(0) == 0) {
		
		i.slice(1);
	}

}



//get response
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//remove element
function remove(id)
{
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

