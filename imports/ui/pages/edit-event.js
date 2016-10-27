import './edit-event.html';

function initDateTimePickers() {
    $('[name=endDate]').data('DateTimePicker').setMinDate($('[name=startDate]').data('DateTimePicker').date);
    $('[name=startDate]').data('DateTimePicker').setMaxDate($('[name=endDate]').data('DateTimePicker').date);
    $('[name=startDate]').data('DateTimePicker').setMinDate(moment().toDate())
    $('[name=startDate]')
        .on("dp.change", () => {
            $('[name=endDate]').data('DateTimePicker').setMinDate($('[name=startDate]').data('DateTimePicker').date);
        });
    $('[name=endDate]')
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
        Router.go('myEvents');
    }
});