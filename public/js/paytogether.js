Parse.initialize("ZWJYl2molT6LxpiIpgd1yumt2bfOEHzJDq1EjLRr", "c2Xnob8YsgCcvIf38SRUrlcGUiHxdgxb8Skj506T");

var Balance = Parse.Object.extend("Balance");
var Record = Parse.Object.extend("Record");
var numRecords = 1; // load num of records every time

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
 
 	var promise = Parse.Promise.as();
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
  	return promise;
}

function loadData(){
	//$("#data-msg").html("will update data");
	var promises = [];
	promises[0] = loadBalance();
	promises[1] = loadRecords();

  	return Parse.Promise.when(promises);
}

function loadBalance(){

	var promise = new Parse.Promise();

	var currentUser = Parse.User.current();
	console.log(currentUser);

  	var queryBalance = new Parse.Query("Balance");
  	queryBalance.equalTo("createdByUser", currentUser.get("username"));
  	queryBalance.equalTo("projectName", "test1");
  	console.log(currentUser.get("username"));

  	queryBalance.first({
        success: function(objects) {
        	var balance = objects.get("value");
        	$("#balance").html("$" + balance); 
        	console.log("hello, balance is " + balance);
        	promise.resolve();
        },
        error: function(objects, error) {
        	console.log("An error occured :(" + error.code + " " + error.message);
           	$("#error-msg").html("An error occured :(" + " " + error.message);
           	promise.reject();

        }
    });

  	return promise;
}

function loadRecords() {

  	var promise = new Parse.Promise();
  	var currentUser = Parse.User.current();
  	var queryRecord = new Parse.Query("Record");
  	
  	queryRecord.equalTo("createdByUser", currentUser.get("username"));
  	queryRecord.descending("createdAt");	// Retrieve the most recent ones

    queryRecord.limit(numRecords); // Only retrieve the last 5
    

	
	queryRecord.find({
  		success: function(results) {
    		console.log("Successfully retrieved " + results.length + " inputs.");
    		// Do something with the returned Parse.Object values
    		// only show 5 records

    		for (var i = 0; i < results.length ; i++) { // show 5 more records
      			var object = results[i];
      			$("#h" + parseInt(i)).html(object.get("money"));
      			$("#d" + parseInt(i)).html(object.get("description"));
 

      			console.log(parseInt(i) + " - " + object.get("money"));
    		}
    		console.log(results.length > 0);

    		promise.resolve();

  		},
  		error: function(error) {
        console.log("An error occured :(" + error.code + " " + error.message);
        	promise.reject();

  		}
	});
	return promise;
}

function showAll(){
	console.log("show all");

  var promise = new Parse.Promise();
  var currentUser = Parse.User.current();
  var queryRecord = new Parse.Query("Record");
    
  queryRecord.equalTo("createdByUser", currentUser.get("username"));
  queryRecord.descending("createdAt");  // Retrieve the most recent ones
  
  var title =  "<tr><th>Latest</th><th>Amount</th><th>Description</th></tr>"
 
  queryRecord.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " inputs.");
        // Do something with the returned Parse.Object values
        $("#long-table").append(title);

        for (var i = 0; i < results.length ; i++) { // show 5 more records
            var object = results[i];
            var entry = "<tr><td>"    + parseInt(i+1) 
                + "</td><td>" + object.get("money")
                  + "</td><td>" + object.get("description") 
                  + "</td></tr>";

            $("#long-table").append(entry);

            console.log(parseInt(i) + " - " + object.get("money"));
        }
        console.log(results.length > 0);
        $("#collapse-msg").html(" ");
        promise.resolve();

      },
      error: function(error) {
        console.log("An error occured :(" + error.code + " " + error.message);
        $("#collapse-msg").html("Can't get history.");
        promise.reject();

      }
  });
  return promise;
 
}

function cleanData(user){
	//$("#data-msg").html("data goes here");
}

function newRecord(){
	var promises = []; 
	var promise = Parse.Promise.error("An error message.");
	console.log("new Record");
	var money = parseInt($("#new-expense").val());
	var description = $("#new-expense-des").val();

	console.log(money);
  console.log(isNaN(money));
    
    if(isNaN(money)) {  //only number can be added
   		$("#error-msg").html("Must input numbers.");
   		return promise;
   	}
  	else {
  		var currentUser = Parse.User.current();
  		var newRecord = {
	 		isExpense: true, 
	 		money: money, 
	 		numUsers: 2,
	 		description: description,
   			createdByUser: currentUser.get("username"),
   			projectName: "test1", //need to create project later
   			tag: []
   		};

   		promises[0] = saveRecord(newRecord);
  		promises[1] = saveBalance(money);
  		return Parse.Promise.when(promises);

	};

}

function saveBalance(money){
	var promise = new Parse.Promise();
	var newBal = money;
	var currentUser = Parse.User.current();
	var queryBalance = new Parse.Query("Balance");
   	queryBalance.equalTo("createdByUser", currentUser.get("username"));
    queryBalance.equalTo("projectName", "test1");

 	queryBalance.first({
      	success: function(bal) {
      	
      			// save new record to database
	 		newBal += bal.get("value");  // update balance on database & screen         
    		bal.set("value", newBal);
    		bal.save();
    		promise.resolve(newBal);
    	}, 
    	error: function(obj, error) {
    		console.log("can't save new balance. :(" + " " + error.message);
    		$("#error-msg").html("can't save new balance. :(" + " " + error.message);
			promise.reject();
    	}
  	});
  	return promise;
}

function saveRecord(rec){
	
	var newRecord = new Record(); 
	// set ACL
    var recordACL = new Parse.ACL(Parse.User.current());
    recordACL.setPublicReadAccess(false);   
    newRecord.setACL(recordACL);

    return newRecord.save(rec);
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
	initUser();

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
		});
	});

	$("#addBtn").click(function(){

		newRecord().then(function(){
			initUser();
			$("#new-expense").val("");
			$("#new-expense-des").val("");
		}, function(error){
			//error goes here		
		});
	});

 /* $("#showAllBtn").click(function(){
    showAll();
    console.log("here here");
    },function(error){

  })
  ;
*/

}) // end of "document ready" of jQuery