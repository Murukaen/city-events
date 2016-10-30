import './edit-event.html';
import '/imports/ui/components/labels.js';

function initValidator(template) {
    var validator = $('.event-setup').validate({
        rules: {
            
        },
        submitHandler: function(event) {
            var data = {
                _id: template.data._id, 
                location: $('[name=location]').val(),
                startDate: $('#start-date').data('DateTimePicker').date().toDate(),
                endDate: $('#end-date').data('DateTimePicker').date().toDate(),
                description: $('[name=description').val(),
                labels: template.labels.get(),
            }
            Meteor.call('updateEvent', data, () => {
                Router.go('myEvents');
            });
        }
    });
}

function initDateTimePickers(template) {
    // $('[name=endDate]').data('DateTimePicker').minDate($('[name=startDate]').data('DateTimePicker').date());
    // $('[name=startDate]').data('DateTimePicker').maxDate($('[name=endDate]').data('DateTimePicker').date());
    $('#start-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            minDate: moment().toDate(),
            defaultDate: template.data.startDate,
            useCurrent: false
        })
        .on("dp.change", () => {
            $('#end-date').data('DateTimePicker').minDate($('#start-date').data('DateTimePicker').date());
        });
    $('#end-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            defaultDate: template.data.endDate
        })
        .on("dp.change", () => {
            console.log("End date changed");
            $('#start-date').data('DateTimePicker').maxDate($('#end-date').data('DateTimePicker').date());
        });
}

Template.editEvent.onCreated( () => {
    Template.instance().labels = new ReactiveVar(Template.currentData().labels);
});

Template.editEvent.onRendered( () => {
    let template = Template.instance();
    initDateTimePickers(template);
    initValidator(template);
});

/* EVENTS */
Template.editEvent.events({
    'submit form': function(event) {
        event.preventDefault();
    },
    'keypress input[name="label"]': function(event, template) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let labels = Template.instance().labels;
            labels.set(labels.get().concat(event.target.value));
            event.target.value = '';
        }
    }
});

/* HELPERS */
Template.editEvent.helpers({
    labels() {
        return Template.instance().labels.get(); 
    }
})