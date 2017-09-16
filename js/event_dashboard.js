/**********************************************
*	GitHub Public Events Dashboard
*	Copyright (c) 2017 Kelsey Claspill
*
*	Filename: event_dashboard.js
*********************************************/

var repoLink = "";
var githubAPI = 'https://api.github.com/events';
//var jqxhr = "";


//Function that runs when the page is loaded
function loaded() {
	
	refreshFeed(); //Gets public events and loads the feed
	
	//Function that enable the pull-header and uses it to refresh the feed
	//jQuery.scrolls created by Gilles Grousset (GitHub user zippy1978)
	jQuery(function($) {
		//Hide pull header before it is pulled
		$('#ui-content').scrollz('hidePullHeader');
	// Enable scrollz
	$('#ui-content').scrollz({
		pull: true,
		emulateTouchEvents: true
	});
  
	// Bind pulled event refreshFeed
	$('#ui-content').bind('pulled', function() {
		refreshFeed();
    
    // Hide pull header when done
    $('#ui-content').scrollz('hidePullHeader');
  });
});

//Function that takes login info from form and uses it to authenticate user
//After auth, users feed of events is written and their info is added to the My Events page
$( "#login").submit(function (e) {
	//console.log("sign in");
	var un = document.forms["login"]["un"].value;
	var pw = document.forms["login"]["pw"].value;
	var auth = btoa(un + ":" + pw);
	var  eventType, repository = "";
	$(".myFeed").empty();  //To empty out any previous data
	//console.log(un);
	$('myFeed').listview().listview('refresh');  //Makes sure listview is initialized
	var jqxhr=$.ajax({
	headers: { Authorization: "Basic " + auth },
	method: "GET",
	url: 'https://api.github.com/users/' + un + '/events',
	//data: {"type"},
	dataType: 'json'
		})
		//On successful auth and events call
		.done(function() {
		var myEventsObj = JSON.parse(jqxhr.responseText);
		//console.log("success");
		//console.log(myEventsObj);
		
		//Loop to write events from myEventsObj to .myFeed listview
		for (i = 0; i < myEventsObj.length; i++)
		{
			eventType = myEventsObj[i].type;
			repository = myEventsObj[i].repo.name;
			$('.myFeed').append('<li><h2>'+eventType+'</h2><p>To '+repository+'</p></li>').listview('refresh');
		}
		
		//Put username and avatar on page
		$("#userDetail").empty();
		$("#userDetail").append('<img src = "' + myEventsObj[0].actor.avatar_url + '"><b>'+ myEventsObj[0].actor.login +'</b>');
		
	})
		//on failed auth and events call
		.fail(function() {
		//console.log("error");
		}) 
		//Changes the page after finish
		jqxhr.done($(":mobile-pagecontainer").pagecontainer("change", "#myEvents"));
	
	//Prevents the form submit's default behavior
	e.preventDefault();
});
}

//Function to refresh the public events feed
function refreshFeed() {
	$(".feed").empty();
	var jqxhr = $.getJSON(githubAPI, function() { console.log("success");
		})
		.done(function( ) {
			//console.log(jqxhr);
			responseObj = JSON.parse(jqxhr.responseText);
			console.log("success 2");
		})
		.fail(function() {
			console.log("error");
			})
		.always(function() {
			console.log("complete");
	});

	jqxhr.done(showEvents);
	}

	
//Function to open the repository link in a new window
function openRepo() {
window.open(repoLink);
}

//Function to create the Event Details page, depending on the event selected
function createDetails(i) {

//console.log("test");
repoLink = "https://github.com/" + responseObj[i].repo.name;
$(".button-holder").empty();
//$(".button-holder").append('test');
$(".button-holder").append('<button class="ui-btn" onclick = "openRepo()">View This Repository</button>');
$(".detailLine").empty();
$(".detailLine").append('<li><img src = "' + responseObj[i].actor.avatar_url + '"> <h2>Username</h2><p>' + responseObj[i].actor.login + '</p></li>');
$(".detailLine").append('<li><h2>Event Type</h2><p>' + responseObj[i].type + '</p></li>');
$(".detailLine").append('<li><h2>Repository</h2><p>' + responseObj[i].repo.name + '</p></li>');

$(".detailLine").listview().listview('refresh');

}

//Function to display events
function showEvents() {
	//var responseObj = JSON.parse(jqxhr.responseText);
	var username, eventType, repository = "";

	for (i = 0; i < responseObj.length; i++) 
	{
		username = responseObj[i].actor.login;
		eventType = responseObj[i].type;
		repository = responseObj[i].repo.name;

		//eventInfo = username + " did a " + eventType + " to the " + repository + " respository.";
		//console.log(responseObj[i].type);

		$('.feed').append('<li ><a href = "#details" onclick = "createDetails(' + i + ')"><h2>'+eventType+'</h2><p>By '+username+'</p><p>To '+repository+'</p></a></li>').listview('refresh');
	}
	$(".feed").listview('refresh');
	
}
	
