import './my-events.html';

import '../components/show-events.js';

Template.myEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({createdBy: Meteor.user().profile.organizerName}).fetch(),
            clickRoute: 'edit'
        }
    }
});