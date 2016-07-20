import './navigation.html';
import './login.js';
import './register.js';

Template.navigation.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('home');
    }
});