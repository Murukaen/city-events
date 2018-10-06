import './my-events.html'
import './my-events.css'

import '../../components/show-events'
import '../../helpers/query'

import {Events} from '/imports/api/events/events.js';

function updateFutureFilter() {
    let future = $('#filterFutureInput').is(':checked');
    let past = $('#filterPastInput').is(':checked');
    let text = "Future & Past";
    if (future && !past) {
        text = "Future";
    }
    if (!future && past) {
        text = "Past";
    }
    if (!future && !past) {
        text = "None";
    }
    $('#futureFilter a .selected').text(text);
}

Template.myEvents.onCreated(function () {
    Template.instance().route = Router.current().originalUrl.split('?')[0]
})

Template.myEvents.onRendered(function () {
    let query = Session.get('query');
    $('#filterFutureInput').prop('checked', query.future === "true");
    $('#filterPastInput').prop('checked', query.past === "true");
    updateFutureFilter();
    Session.set('activeTabName', 'my-events')
});

Template.myEvents.events({
    'change #futureFilter input': function(event, template) {
        Query.filter(template.route, event.target.name, $(event.target).is(':checked'));
    }
});

Template.myEvents.helpers({
    eventData() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'edit'
        }
    }
});