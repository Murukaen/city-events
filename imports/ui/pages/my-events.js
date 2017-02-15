import './my-events.html';
import './my-events.css';

import '../components/show-events.js';
import '../helpers/query.js';

function updateFutureFilter() {
    let future = $('#filterFutureInput').is(':checked');
    let past = $('#filterPastInput').is(':checked');
    let text = "Future & Past";
    console.log("future", future);
    console.log("past", past);
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

Template.myEvents.onRendered(function () {
    let query = Session.get('query');
    $('#filterFutureInput').prop('checked', query.future === "true");
    $('#filterPastInput').prop('checked', query.past === "true");
    updateFutureFilter();
});

Template.myEvents.events({
    'change #futureFilter input': function(event, template) {
        Query.filter('myEvents', event.target.name, $(event.target).is(':checked'));
    }
});

Template.myEvents.helpers({
    eventData: function() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'edit'
        }
    }
});