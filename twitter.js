window.onload = initialize;

// Global request variable
var request;

// Global search variable
var searching;

// Global username variable
var username; 

// Initialize on window load
function initialize() {
   
    // Get our search button and setup an event handler
	searching= document.getElementById("searchButton");
	searching.onclick= userLookup;
	
	
	// When the user presses enter, the form isn't submitted, but userLookup is stil called as if the 					    // user had clicked the search button
	var form = document.getElementsByTagName("form");
	form[0].onsubmit = function(event){
		userLookup();
		return false;
	}
	
    // Setup our request object
	request = null;
	createRequest();	
}

/* 
 * 
 * This is the function that is called when the "search" button is clicked
 * It gets the Twitter username from the text input and sends it to the appropriate URL.
 * It then sets up the callback function to process the results.
 * And it provides some information about what's going on.
 *
 */
function userLookup() {
    
	username=document.getElementById('username').value;
	
	/* Here is the url we will need to call, with the username omitted */
	var url="http://info230.cs.cornell.edu/users/cjl2test/www/hw1/user.php?username="+ username;
	
	if(username==""){
		document.getElementById("messageText").innerHTML="Please enter a user";
	}
	else{
		/* Set up the Ajax call */
		request.open("GET", url, true);
		request.onreadystatechange= processUser;
		
		/* Make the Ajax call */
		request.send(null);
	
		// Sending user info msg
		document.getElementById("messageText").innerHTML="Sending user request";
	}
}

/* 
 * 
 * This is the function that is called after the user has been processed to check if the user exists 
 * to get the tweets for the corresponding username
 * It gets the Twitter username from the text input and sends it to the appropriate URL.
 * It then sets up the callback function to process the results.
 * And it provides some information about what's going on.
 *
 */
function tweetLookup() {
    
	/* Here is the url we will need to call, with the username omitted*/
	var url="http://info230.cs.cornell.edu/users/cjl2test/www/hw1/tweets.php?username="+ username;
	
	/* Set up the Ajax call*/
	
	// Create the request again, so that you can open it again without reloading the page using the 				    // same information input from userLookup
	createRequest();
	
	request.open("GET", url, true);
	request.onreadystatechange= processTweets;
	
	/* Make the Ajax call*/
	
	request.send(null);
	
	// Sending user tweet msg
	document.getElementById("messageText").innerHTML="Sending tweet request";
}
/*
 *
 * Actually process the results of the AJAX callin userLookup
 *
 */
function processUser() {
	
	// Processing user info msg if the readyState is <4, therefore the input hasnt been processed by    // the server yet
	if(request.readyState <4) {
		document.getElementById("messageText").innerHTML="Processing user";
	}
	
	// When the input has been processed
	if(request.readyState == 4) {
		var name= document.getElementById("profilename");
		var loc= document.getElementById("profileloc");
		var desc= document.getElementById("profiledesc");
		var img= document.getElementById("profileimg");
		var tweetnumb= document.getElementById("profiletweet");
		var following= document.getElementById("profileing");
		var followers= document.getElementById("profileers");
		// Check if user exists
		if(request.responseText==""){
			document.getElementById("messageText").innerHTML="User does not exist";
			name.innerHTML="";
			loc.innerHTML="";
			desc.innerHTML="";
			img.src="blank.jpg";
			tweetnumb.innerHTML="";
			following.innerHTML="";
			followers.innerHTML="";
			document.getElementById("tweetlist").innerHTML="";
			return;
		}
		
		profileInfo = eval('(' + request.responseText + ')'); 
		
		// With input processed, assign to the associated profileInfo variable through innerHTML to 	        // replace the old input
		name.innerHTML=profileInfo.screen_name;
		loc.innerHTML=profileInfo.location;
		desc.innerHTML=profileInfo.description;
		img.src=profileInfo.profile_image_url;
		tweetnumb.innerHTML=profileInfo.statuses_count;
		following.innerHTML=profileInfo.friends_count;
		followers.innerHTML=profileInfo.followers_count;
		
		// Processed user info msg
		document.getElementById("messageText").innerHTML="User processed";
		
		request = null;
		
		// Call tweetLookup with the same input	
		tweetLookup();
	}		
}
/*
 *
 * Actually process the results of the AJAX call in tweetLookup
 *
 */
function processTweets() {
	if(request.readyState <4) {
		// Processing user tweets msg
		document.getElementById("messageText").innerHTML="Processing tweets";
	}
	if(request.readyState == 4) {
		var img= document.getElementById("profileimg");
		var tweet= document.getElementById("tweetlist");
		// To make sure the tweets are cleared each time the user enters new input
		tweet.innerHTML="";
			
		//check if tweets are blocked
		if(request.responseText==""){
			document.getElementById("messageText").innerHTML="User tweets are blocked";
			tweet.innerHTML="";
			return;
		}
						
		tweets= eval('(' + request.responseText + ')'); 
		var recentTweets="";
		
		var j=0;
		
		for (j = 0; j<tweets.length; j++) {
			recentTweets= recentTweets + " " +(j+1)+ ". "+  tweets[j].text+"<br /><br />";
			
			
		}
		
		tweet.innerHTML=recentTweets;
		
		// Processed user tweets msg
		document.getElementById("messageText").innerHTML="Tweets processed";
		
		// Completed request msg
		document.getElementById("messageText").innerHTML="Here are your results:";
	}
}


/*
 *
 * This function creates the Ajax request object; don't need to understand this
 *
 */

function createRequest() {

	// From "Head Rush Ajax" by Brett McLaughlin

	try {
		request = new XMLHttpRequest();
	} catch (trymicrosoft) {
		try {
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (othermicrosoft) {
			try {
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (failed) {
				request = null;
			}
		}
	}
	
	if (request == null) {
		alert("Error creating request object!");
	}

}
