import './show-events.html';
//import {Events} from '/imports/api/events/events.js';

Template.showEvents.helpers({
    'event': function() {
        return Events.find();
    },
    'formatDate': function(date) {
        return moment(date).format("DD-MM-YYYY HH:mm");
    }
});

Template.showEvents.events({
    'click .event-box': function() {
        console.log("Click");
        Router.go('view', {_id: this._id});
    }
});