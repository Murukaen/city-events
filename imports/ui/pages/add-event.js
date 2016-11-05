import './add-event.html';
import './add-event.css'
import '/imports/api/events/methods.js';
import '/imports/ui/components/labels.js';

function initValidator(template) {
    var validator = $('.event-setup').validate({
        rules: {
            name: {
                maxlength: 20
            }
        },
        submitHandler: function(event) {
            var data = {
                name: $('[name=name]').val(),
                location: $('[name=location]').val(),
                startDate: $('#start-date').data('DateTimePicker').date().toDate(),
                endDate: $('#end-date').data('DateTimePicker').date().toDate(),
                description: $('[name=description').val(),
                labels: template.labels.get(),
                createdBy: Meteor.user().profile.organizerName
            }
            Meteor.call('addEvent', data, () => {
                Router.go('myEvents');
            });
        }
    });
}

function initDateTimePickers() {
    $('#start-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            minDate: new Date(),
            useCurrent: false
        })
        .on("dp.change", () => {
            var startDate = $('#start-date').data('DateTimePicker').date()
            $("#end-date").data('DateTimePicker').minDate(startDate);
        });
    $('#end-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
        })
        .on("dp.change", () => {
            var endDate = $('#end-date').data('DateTimePicker').date()
            $("#start-date").data('DateTimePicker').maxDate(endDate);
        });
}

Template.addEvent.onCreated(() => {
    let template = Template.instance();
    template.labels = new ReactiveVar([]);
});

Template.addEvent.onRendered(function() {
    initValidator(Template.instance());
    initDateTimePickers();
});

/* EVENTS */
Template.addEvent.events({
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
Template.addEvent.helpers({
    labels() {
        return Template.instance().labels.get(); 
    }
})