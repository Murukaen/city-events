import '../components/show-events.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';

function filter(name, value) {
    let query = Session.get('query');
    query[name] = value;
    Router.go('home', {}, {query: $.param(query)});
}

Template.allEvents.onCreated(function () {
    let template = Template.instance();
    let currentLabel = Session.get('query').label;
    template.labels = new ReactiveVar(currentLabel ? [currentLabel] : []);
});

/* EVENTS */
Template.allEvents.events({
    'submit #searchForm': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val();
        filter('label', value.toLowerCase());
    },
    'click #dateFilter ul': function(event, temaplte) {
        event.preventDefault();
        $('#dateFilter').find('.selected').text($(event.target).text());
        filter('date', event.target.name);
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
        return Template.instance().labels.get(); 
    }
});