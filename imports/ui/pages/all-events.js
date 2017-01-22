import '../components/show-events.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';

Template.allEvents.onRendered(function () {
    $('#dateFilter').find('ul').find('a').click(function() {
        $('#dateFilter').children('a').find('.selected').text($(this).text());
        console.log($(this).text());
    });
});

/* EVENTS */
Template.allEvents.events({
    'submit form': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val()
        Router.go('home', {}, {query: 'label=' + value});
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