import './add-edit-event.html';
import './add-edit-event.css';
import '../components/labels.js';
import '/imports/api/events/methods.js';

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
            var methodName = 'addEvent';
            if(template.data) {
                data._id = template.data._id;
                methodName = 'updateEvent';
            }
            // console.log("methodName", methodName);
            Meteor.call(methodName, data, () => {
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
            minDate: new Date(),
            defaultDate: template.data ? template.data.startDate : undefined, 
            useCurrent: false
        })
        .on("dp.change", () => {
            var startDate = $('#start-date').data('DateTimePicker').date()
            $("#end-date").data('DateTimePicker').minDate(startDate);
        });
    $('#end-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            defaultDate: template.data ? template.data.endDate : undefined 
        })
        .on("dp.change", () => {
            var endDate = $('#end-date').data('DateTimePicker').date()
            $("#start-date").data('DateTimePicker').maxDate(endDate);
        });
}

Template.addEditEvent.onCreated(() => {
    let template = Template.instance();
    template.labels = new ReactiveVar(template.data ? template.data.labels : []);
});

Template.addEditEvent.onRendered(function() {
    let template = Template.instance();
    initValidator(template);
    initDateTimePickers(template);
});

/* EVENTS */
Template.addEditEvent.events({
    'submit form': function(event) {
        event.preventDefault();
    },
    'keypress input[name="label"]': function(event, template) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let labels = Template.instance().labels;
            labels.set(labels.get().concat(event.target.value.toLowerCase()));
            event.target.value = '';
        }
    }
})

/* HELPERS */
Template.addEditEvent.helpers({
    labels() {
        return Template.instance().labels.get(); 
    }
})