import './login.html';

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        Meteor.loginWithPassword(event.target.email.value, event.target.password.value, function(error) {
            if (error) {
                console.log(error.reason);
            }
            else if (Router.current().route.getName() == 'login') {
                Router.go('home');
            }
        });
    }
});