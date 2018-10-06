import './navigation.html';
import './navigation.css';
import './login.js';
import './register.js';

Template.navigation.onRendered(function () {
    this.autorun(() => {
        let activeTabName = Session.get("activeTabName")
        if (activeTabName) {
            $('#template-navigation .tab').css('font-weight','')
            $(`#template-navigation .tab[name=${activeTabName}]`).css('font-weight', 'bold')
        }
    })
})

Template.navigation.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('pickCountry');
    }
});