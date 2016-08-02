import '../components/show-events.js';

import './my-events.html';

Template.myEvents.onCreated(function () {
    this.subscribe('events');
});

Template.myEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({createdBy: Meteor.user().emails[0].address}).fetch(),
            clickRoute: 'edit'
        }
    }
});