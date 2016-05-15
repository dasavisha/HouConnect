Template.signIn.onRendered(function(){
  $('.ui.accordion').accordion('close', 0);
  $('.ui.form')
    .form({
      fields: {
        password: {
          identifier : 'password',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a password'
            },
            {
              type   : 'minLength[6]',
              prompt : 'Your password must be at least 6 characters'
            }
          ]
        }
      }
    });
});

var loginMethods = {

  facebook : function(){
    Meteor.loginWithFacebook({
      requestPermissions: ['email']
    }, function (err) {
      if (err){
        Session.set('loginErrorMessage', err.reason || 'Unknown error');

      }
      else{
        loginToast();
        redirection();
      }
    });
  },

  google : function(){    

    Meteor.loginWithGoogle({
          requestPermissions: ['email']
      }, function (err) {
          if (err)
          Session.set('loginErrorMessage', err.reason || 'Unknown error');
        else{
          loginToast();
          redirection();
        }
      });
  },

  twitter: function(){
    //TODO: twitter not giving mail. wont work for now
    //need to fill email from user later
    Meteor.loginWithTwitter({
      requestPermissions: ['email']
    },function(err){
      if(err){
        console.log(err);
      }
      else{
        loginToast();
        redirection();
      }
    });
  }
 };


var loginToast= function(){
  Meteor.setTimeout(function(){
      sAlert.info('Welcome to HouConnect!');
    },200);
 
};
var redirection=function(){
  Meteor.setTimeout(function(){

  console.log("Status:",Meteor.user());
  if(Meteor.user().status==="incomplete")
    Router.go('getStarted');
  else
    history.go(-1);
},200);
};
var clearModal=function(){
  $('.ui.modal').modal('hide');
  $('.ui.dimmer').css('display','none');
};
Template.signIn.events({
  'submit #passwordForm': function(event) {
    event.preventDefault();
    var usernameOrEmail = event.target.usernameOrEmail.value.trim();
    var password = event.target.password.value;
    
    Meteor.loginWithPassword(usernameOrEmail, password, function(error) {
      if (error) {
        console.log(error);
        switch(error.reason){
          case 'Incorrect password':
          case 'User not found': 
            //
            sAlert.error('Invalid username/email or password');
        }
      }
      else{

        redirection();
        loginToast();
      }
    });

  },
  'click #facebook-login':function(event){
    loginMethods.facebook();
  },
  'click #twitter-login':function(event){
    loginMethods.twitter();

  },
  'click #google-login':function(event){
    loginMethods.google();
  }
});

