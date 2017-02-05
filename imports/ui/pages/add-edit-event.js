import './add-edit-event.html';
import './add-edit-event.css';
import '../components/labels.js';
import '/imports/api/events/methods.js';

function appendError(errorObj, name,type) {
    switch(type) {
        case 'unique':
            errorObj[name] = name + ' already present';
            break;
        default:
            errorObj[name] = type;
    }
}

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
                labels: template.labels.getLabels(),
                createdBy: Meteor.user().profile.organizerName
            }
            var methodName = 'addEvent';
            if(template.data) {
                data._id = template.data._id;
                methodName = 'updateEvent';
            }
            Meteor.call(methodName, data, (err) => {
                if (err) {
                    if (err.reason == "Internal server error") {
                        console.log("Internal server error:", err);
                    }
                    else {
                        console.log("Error (details):", err.details);
                        let errors = {};
                        err.details.forEach((e) => {
                            appendError(errors, e.name, e.type);
                        });
                        template.errors.set(errors);
                    }
                }
                else {
                    Router.go('myEvents');
                }
            });
        }
    });
}

function initDateTimePickers(template) {
    $('#start-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            minDate: template.data ? undefined : new Date(),
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
    template.labels = new Labels(template.data ? template.data.labels : null);
    template.errors = new ReactiveDict();
});

Template.addEditEvent.onRendered(function() {
    let template = Template.instance();
    initValidator(template);
    initDateTimePickers(template);
});

/* EVENTS */
Template.addEditEvent.events({
    'submit form': function(event, template) {
        event.preventDefault();
    },
    'keypress input[name="label"]': function(event, template) {
        if (event.key === 'Enter') {
            event.preventDefault();
            template.labels.addLabel(event.target.value.toLowerCase());
            event.target.value = '';
        }
    }
})

/* HELPERS */
Template.addEditEvent.helpers({
    'labels': function() {
        return Template.instance().labels; 
    },
    'error': function(name) {
        return Template.instance().errors.get(name);
    }
});