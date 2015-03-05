Parse.initialize("ZWJYl2molT6LxpiIpgd1yumt2bfOEHzJDq1EjLRr", "c2Xnob8YsgCcvIf38SRUrlcGUiHxdgxb8Skj506T");

var Balance = Parse.Object.extend("Balance");
var Record = Parse.Object.extend("Record");

function signupUser(){
	console.log("sign up user!");        
	var promise = new Parse.Promise();
	var currentUser = Parse.User.current();
	if (currentUser) {
		console.log("can't sign up , already log in.");
	} else {
		var username = $("#signup-username").val();
    	var password = $("#signup-password").val();
 	   	var email = $("#signup-email").val();
   		var user = new Parse.User();
   		user.set("username", username);
    	user.set("password", password);
    	user.set("email", email);
    	user.signUp(null, {
    		success: function(user){
 			    console.log(username + " signed up.");
    			promise.resolve("created new user");
    		},
    		error: function(user, error){
			    console.log(username + " failed signing up.");
    			promise.reject("can't sign up");
  	           	$("#error-msg").html("An error occured :( " +"<br>"+ error.message);

    		}
    	});
    	console.log(promise);
    	return promise;
	}

}

function loginUser(){
	var promise = new Parse.Promise();
	var username = $("#login-username").val();
    var password = $("#login-password").val();
    console.log([username, password]);
	Parse.User.logIn(username, password, {
		success: function(user){
			promise.resolve("user logged in");
			console.log("log in user!");        
			console.log(promise);
		},
		error: function(user, error){
			promise.reject("failed to log in");
			console.log("failed to log in user!");    
			console.log(promise);
  	        $("#error-msg").html("An error occured :( " +"<br>"+ error.message);
    	}
	});
	return promise;
}

function logoutUser(){
	var promise = new Parse.Promise();
	Parse.User.logOut();
	var user = Parse.User.current();
	if(user) {
		promise.reject("can't log out user");
		console.log("fail to log out user!");   
  	    $("#error-msg").html("An error occured :( ");
		console.log(promise);
	} else {
		promise.resolve("user has logged out.");
		console.log("log out user!");   
		console.log(promise);
	};
	
	return promise;
}

function initUser(){
	console.log("Get ready!");       
    $("#error-msg").html("");
 
	var currentUser = Parse.User.current();
  	if (currentUser) {
  		console.log( currentUser.get("username") + " has logged in.");   
  		// hide log-in page, display log out page
		$("#msg").html("Good day, " + currentUser.get("username"));

  		$("#userLogin").hide();
		$("#userSignup").hide();

		$("#data").show();
		$("#userLogout").show();
		loadData();
  } else {
		console.log("User has not logged in.");        
		// display log-in page, hide log-out page
		$("#msg").html("Good day, stranger.");
		$("#data").hide();
		$("#userLogout").hide();
		$("#userLogin").show();
		$("#userSignup").show();
 		cleanData();
  }
}

function loadData(user){
	$("#data-msg").html("will update data");
}

function cleanData(user){
	$("#data-msg").html("data goes here");
}

function newRecord(){
	var promise = Parse.Promise.as("The good result.");
	console.log("new Record");
	return promise;
}

function newProject(){
	var promise = new Parse.Promise();
	var currentUser = Parse.User.current();
    
    //create database with ACL security
    
    var balance = new Balance();
    balance.set("value", 0);
    balance.set("createdByUser", currentUser.getUsername());
    balance.set("projectName","test1");// need to implement creating project
    // set ACL
    var balanceACL = new Parse.ACL(Parse.User.current()); 
    balanceACL.setPublicReadAccess(false);
    balance.setACL(balanceACL);
    balance.save(null, {
    	success: function (){
    		promise.resolve("new project done");
   			console.log("new project");
    	}, 
    	error: function(){
    		promise.reject("can't create project");
   			console.log("can't create project");
    	}
    }); //error handling 

	return promise;
}

$(document).ready(function(){
	$("#signupBtn").click(function(){
		signupUser().then(function(){
			//success
			initUser();
		}, function(error) {
			//error goes here
		}).then(function(){
			//success, create new project
			newProject();
		},function(error){
			//error goes here

		});
	})

	$("#loginBtn").click(function(){
		loginUser().then(function(){
			//success
			initUser();
		}, function(error) {
			//error goes here		
		});;
	})

	$("#logoutBtn").click(function(){
		logoutUser().then(function(){
			//success
			initUser();
		}, function(error) {
			//error goes here		
		});;;
	})

	$("#addBtn").click(function(){
		newRecord().then(function(){

		}, function(error){

		});
	});

}) // end of "document ready" of jQuery