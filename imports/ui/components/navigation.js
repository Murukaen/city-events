import './navigation.html';
import './navigation.css';
import './login.js';
import './register.js';

Template.navigation.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('pickCountry');
    }
});