import './login.html';
import './login.css';

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.login.onRendered(function () {
    var validator = $('.login').validate({
        submitHandler: function(event) {
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
    }
});