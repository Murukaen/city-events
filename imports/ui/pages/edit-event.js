import './edit-event.html';

function initDateTimePickers() {
    $('[name=endDate]').data('DateTimePicker').minDate($('[name=startDate]').data('DateTimePicker').date());
    $('[name=startDate]').data('DateTimePicker').minDate(moment().toDate())
    $('[name=startDate]').data('DateTimePicker').maxDate($('[name=endDate]').data('DateTimePicker').date());
    $('[name=startDate]')
        .on("dp.change", () => {
            $('[name=endDate]').data('DateTimePicker').minDate($('[name=startDate]').data('DateTimePicker').date());
        });
    $('[name=endDate]')
        .on("dp.change", () => {
            console.log("End date changed");
            $('[name=startDate]').data('DateTimePicker').maxDate($('[name=endDate]').data('DateTimePicker').date());
        });
}

Template.editEvent.onCreated(function () {
    this.subscribe('events');
});

Template.editEvent.onRendered( () => {
    initDateTimePickers();
});

/* EVENTS */
Template.editEvent.events({
    'submit form': function(event) {
        Router.go('myEvents');
    }
});