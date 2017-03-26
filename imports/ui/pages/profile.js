import './profile.html'
import './profile.css'

Template.profile.events({
    'click #fbLink': function() {
        Meteor.linkWithFacebook((err) => {
            if (err) {
                console.error(err);
            }
            else {
                Meteor.call('updateProfile', {key: 'isLinkedWithFacebook', value: true});
            }
        });
    }
})