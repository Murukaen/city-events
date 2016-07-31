import './show-events.html';
import './show-events.css';

Template.showEvents.events({
    'click .event-box': function() {
        Router.go('view', {_id: this._id});
    }
});

Template.showEvents.helpers({
    formatDate: function(date) {
        return moment(date).format("DD-MM-YYYY HH:mm");
    }
});
