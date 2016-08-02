import './edit-event.html';

Template.editEvent.onCreated(function () {
    this.subscribe('events');
});

/* EVENTS */
Template.editEvent.events({
    'submit form': function(event) {
        // console.log()
        Router.go('myEvents');
    }
});

// Template.editEvent.helpers({
//     dateTimePickerOptions: function () {
//         return {
//             format: "DD-MM-YYYY HH:mm"
//         }
//     }
// });