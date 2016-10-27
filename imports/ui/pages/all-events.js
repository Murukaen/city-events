import '../components/show-events.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';

/* EVENTS */
Template.allEvents.events({
    'submit form': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val()
        Router.go('home', {}, {query: 'search=' + value});
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