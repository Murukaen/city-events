import '../components/show-events.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';

Template.allEvents.onCreated(function () {
    let template = Template.instance();
    template.searchQuery = new ReactiveVar();
    template.autorun( () => {
        template.subscribe('events', template.searchQuery.get());
    });
});

/* EVENTS */
Template.allEvents.events({
    'keypress [name=search]': function(event, template) {
        let value = event.target.value.trim();
        if (event.key === 'Enter') {
            template.searchQuery.set(value);
        }
    }
});

/* HELPERS */
Template.allEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'view'
        }    
    }
});