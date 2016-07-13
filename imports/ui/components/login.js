import './login.html';

Template.login.events({
    'submit form': function(event, template) {
        event.preventDefault();
        Meteor.loginWithPassword(template.find("#login-email").value, template.find("#login-pass").value, function(error) {
            if (error) {
                console.log(error.reason);
            }
            // else if (Router.current().route.getName() == 'login') {
            //     Router.go('home');
            // }
        });
    }
});

Template.login.onRendered(function () {
    $('.login').validate();
});