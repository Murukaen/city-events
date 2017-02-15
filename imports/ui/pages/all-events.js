import '../components/show-events.js';
import '../helpers/query.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';


Template.allEvents.onCreated(function () {
    let template = Template.instance();
    let currentLabel = Session.get('query').label;
    template.labels = new Labels(currentLabel ? [currentLabel] : []);
    template.autorun(function () {
        Query.filter('home', 'label', template.labels.getLabels()[0]);
    });
});

Template.allEvents.onRendered(function () {
     let currentDate = Session.get('query').date;
    if (currentDate) {
        $('#dateFilter').find('.selected').text($('#dateFilter').find('[name=' + currentDate.trim() + ']').text());
    }
});

/* EVENTS */
Template.allEvents.events({
    'submit #searchForm': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val().toLowerCase();
        Template.instance().labels.addSingleLabel(value);
    },
    'click #dateFilter ul': function(event, template) {
        event.preventDefault();
        Query.filter('home', 'date', event.target.name);
    }
});

/* HELPERS */
Template.allEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'view'
        }    
    },
    labels() {
        return Template.instance().labels; 
    }
});