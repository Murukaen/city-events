import './add-edit-event.html';
import './add-edit-event.css';
import '../components/labels.js';
import '/imports/api/events/event-methods.js';

function appendError(errorObj, name,type) {
    switch(type) {
        case 'unique':
            errorObj[name] = name + ' already present';
            break;
        default:
            errorObj[name] = type;
    }
}

let DateUtil = {
    getStartDate() {
        return $('#start-date').data('DateTimePicker').date();
    },
    getEndDate() {
        return $('#end-date').data('DateTimePicker').date();
    },
    setEndDate(date) {
        $('#end-date').data('DateTimePicker').date(date);
    },
    setMinEndDate() {
        $("#end-date").data('DateTimePicker').minDate(DateUtil.getStartDate());
    },
    setDefaultEndDate() {
        DateUtil.setEndDate(DateUtil.getStartDate().add(1, 'hours'));
    },
    toggleEndDate(visibility) {
        let element = $('#formEndDate');
        if (visibility) {
            element.show();
        }
        else {
            element.hide();
        }
    },
    initDateTimePickers(template) {
        $('#start-date')
            .datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                minDate: template.data ? undefined : new Date(),
                defaultDate: template.data ? template.data.startDate : undefined, 
                useCurrent: false
            })
            .on("dp.change", () => {
                var startDate = $('#start-date').data('DateTimePicker').date();
                template.startDateSet = !!startDate;
                template.startDateChanged = true;
            });
        $('#end-date')
            .datetimepicker({
                format: "DD-MM-YYYY HH:mm",
                defaultDate: template.data ? template.data.endDate : undefined 
            });
        DateUtil.toggleEndDate(!!DateUtil.getEndDate());
        if(DateUtil.getEndDate()) {
            DateUtil.setMinEndDate();
        }
        template.startDateSet = !!DateUtil.getStartDate();
        template.startDateChanged = false;
    }
};

function initValidator(template) {
    var validator = $('.event-setup').validate({
        rules: {
            name: {
                maxlength: 20
            }
        },
        submitHandler(event) {
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

Template.addEditEvent.onCreated(() => {
    let template = Template.instance();
    template.labels = new Labels(template.data ? template.data.labels : null);
    template.errors = new ReactiveDict();
});

Template.addEditEvent.onRendered(function() {
    let template = Template.instance();
    initValidator(template);
    DateUtil.initDateTimePickers(template);
});

/* EVENTS */
Template.addEditEvent.events({
    'submit form': function(event, template) {
        event.preventDefault();
    },
    'click #deleteButton': function(event, template) {
        Meteor.call('deleteEvent', template.data._id, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                Router.go('myEvents');
            }
        });
    },
    'keypress input[name="label"]': function(event, template) {
        if (event.key === 'Enter') {
            event.preventDefault();
            template.labels.addLabel(event.target.value.toLowerCase());
            event.target.value = '';
        }
    },
    'focusout #inputStartDate': function(event, template) {
        DateUtil.toggleEndDate(template.startDateSet);
        if(template.startDateSet && template.startDateChanged) {
            DateUtil.setMinEndDate();
            DateUtil.setDefaultEndDate();
        }
    }
})

/* HELPERS */
Template.addEditEvent.helpers({
    labels() {
        return Template.instance().labels; 
    },
    error(name) {
        return Template.instance().errors.get(name);
    }
});