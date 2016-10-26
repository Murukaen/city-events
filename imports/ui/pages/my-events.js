import '../components/show-events.js';

import './my-events.html';

Template.myEvents.onCreated(function () {
    this.subscribe('events'); // TODO get only mine
});

Template.myEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({createdBy: Meteor.user().profile.organizerName}).fetch(),
            clickRoute: 'edit'
        }
    }
});