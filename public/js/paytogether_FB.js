Parse.initialize("ZWJYl2molT6LxpiIpgd1yumt2bfOEHzJDq1EjLRr", "c2Xnob8YsgCcvIf38SRUrlcGUiHxdgxb8Skj506T");
 
  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '648150448622687', // Facebook App ID
      status     : true,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.2' // point to the latest Facebook Graph API version
    });
    
    FBUserLogIn();
    // Run code after the Facebook SDK is loaded.


  };

 // Load the SDK asynchronously
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

function FBUserLogIn(){

  Parse.FacebookUtils.logIn(null, {
    success: function(user) {
      if (!user.existed()) {
        console.log("User signed up and logged in through Facebook!");
      } else {
        console.log("User logged in through Facebook!");
      }

      },
    error: function(user, error) {
      console.log("User cancelled the Facebook login or did not fully authorize.");
    }
  });
}
