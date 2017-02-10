import './my-events.html';

import '../components/show-events.js';

Template.myEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'edit'
        }
    }
});