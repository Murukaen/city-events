import './edit-event.html';

Template.editEvent.onCreated(function () {
    this.subscribe('events');
});

/* EVENTS */
Template.editEvent.events({
    'submit form': function(event) {
        event.preventDefault();
        console.log('Submit');
    }
});