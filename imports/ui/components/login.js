import './login.html';

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.login.onRendered(function () {
    $('.login').validate({
        submitHandler: function(event) {
            console.log("submitHandler", $(".login #login-pass").val());
            Meteor.loginWithPassword($(".login #login-email").val(), $(".login #login-pass").val(), function(error) {
                if (error) {
                    console.log(error.reason);
                }
            });
        }
    });
});