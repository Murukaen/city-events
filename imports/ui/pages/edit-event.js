import './edit-event.html';

function initDateTimePickers() {
    $('[name=endDate]').data('DateTimePicker').setMinDate($('[name=startDate]').data('DateTimePicker').date);
    $('[name=startDate]').data('DateTimePicker').setMaxDate($('[name=endDate]').data('DateTimePicker').date);
    $('[name=startDate]')
        .datetimepicker({
            defaultDate: moment(),
            format: "DD-MM-YYYY HH:mm",
            minDate: moment()
        })
        .on("dp.change", () => {
            $('[name=endDate]').data('DateTimePicker').setMinDate($('[name=startDate]').data('DateTimePicker').date);
        });
    $('[name=endDate]')
        .datetimepicker({
            defaultDate: moment(),
            format: "DD-MM-YYYY HH:mm",
        })
        .on("dp.change", () => {
            $('[name=startDate]').data('DateTimePicker').setMaxDate($('[name=endDate]').data('DateTimePicker').date);
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
        // console.log()
        Router.go('myEvents');
    }
});