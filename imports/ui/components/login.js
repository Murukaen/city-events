import './login.html';
import './login.css';

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.login.onRendered(function () {
    var validator = $('.login').validate({
        submitHandler (event) {
            Meteor.loginWithPassword($(".login #login-email").val(), $(".login #login-pass").val(), function(error) {
                if (error) {
                    if(error.reason == "User not found") {
                        validator.showErrors({
                            email: error.reason    
                        });
                    }
                    if(error.reason == "Incorrect password"){
                        validator.showErrors({
                            password: error.reason    
                        });
                    }
                }
            });
        }
    });
});

Template.login.events({
    'click .forgot-pass': function() {
        Router.go('forgot-pass');
    },
    'click #fb-login': function() {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                if (err.reason == 'Must link account first') {
                    console.error("Facebook account is not linked");
                }
                else {
                    console.error("Facebook login failed with:", err);
                }
            }
        });
    }
});