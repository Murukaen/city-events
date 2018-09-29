import '../components/show-events.js'
import '../helpers/query.js'

import './all-events.html'
import './all-events.css'

import {Events} from '/imports/api/events/events.js'

Template.allEvents.onCreated(function () {
    let template = Template.instance();
    let currentLabel = Session.get('query').label;
    template.route = Router.current().originalUrl.split('?')[0]
    template.labels = new Labels(currentLabel ? [currentLabel] : []);
    template.autorun(function () {
        Query.filter(template.route, 'label', template.labels.getLabels()[0]);
    });
    template.allLabels = Array.from(Events.find().fetch()
            .map((event) => event.labels)
            .reduce((set, arr) => new Set(Array.from(set).concat(arr)), new Set()))
});

Template.allEvents.onRendered(function () {
    Meteor.typeahead.inject();
    Session.get('query').date &&
    $('#dateFilter').find('.selected').text(
        $('#dateFilter').find('[name=' + Session.get('query').date.trim() + ']').text())
});

Template.allEvents.events({
    'submit #searchForm': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val().toLowerCase();
        Template.instance().labels.addSingleLabel(value);
    },
    'click #dateFilter ul': function(event, template) {
        event.preventDefault();
        Query.filter(template.route, 'date', event.target.name);
    }
});

Template.allEvents.helpers({
    eventData() {
        return {
            events: Events.find({}, {sort: {endDate: 1}}).fetch(),
            clickRoute: 'view'
        }    
    },
    labels() {
        return Template.instance().labels; 
    },
    allLabels() {
        return Template.instance().allLabels
    }
});