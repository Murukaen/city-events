import './add-edit-event.html'
import './add-edit-event.css'
import '../../components/labels'
import '/imports/api/events/event-methods'

function appendError(errorObj, name, type) {
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
                "pattern": "^(\\s*\\S\\s*){1,}$" // at least one non-space character
            },
            location: {
                "pattern": "^(\\s*\\S\\s*){1,}$" // at least one non-space character
            },
            description: {
                "pattern": "^(\\s*\\S\\s*){1,}$" // at least one non-space character
            }
        },
        submitHandler(event) {
            var data = {
                name: $('[name=name]').val(),
                country: $('[name=country]').val(),
                city:$('[name=city]').val(),
                location: $('[name=location]').val(),
                startDate: $('#start-date').data('DateTimePicker').date().toDate(),
                endDate: $('#end-date').data('DateTimePicker').date().toDate(),
                description: $('[name=description').val(),
                labels: template.labels.get(),
                createdBy: Meteor.userId(),
                staging: $('#unstageInput').length > 0 && !$('#unstageInput').is(':checked')
            }
            var methodName = 'addEvent';
            if(template.data) {
                data._id = template.data._id;
                methodName = 'updateEvent';
            }
            Meteor.call(methodName, data, (err) => {
                let errors = {};
                if (err) {
                    if (err.reason == "Internal server error") {
                        console.log("Internal server error:", err);
                    }
                    else if (Array.isArray(err.details)) {
                        err.details.forEach((e) => {
                            appendError(errors, e.name, e.type);
                        });
                    } else {
                        // err = ALREADY_PRESENT
                        template.alreadyPresent.set(true)
                    }
                }
                else {
                    Router.go('myEvents');
                }
                template.errors.set(errors);
            });
        }
    });
}

Template.addEditEvent.onCreated(() => {
    let template = Template.instance();
    template.labels = new ReactiveVar(template.data ? template.data.labels : [])
    template.errors = new ReactiveDict()
    template.countries = new ReactiveVar()
    template.selectedCountry = new ReactiveVar()
    template.cities = new ReactiveVar()
    template.alreadyPresent = new ReactiveVar(false)
    template.autorun(() => {
        Meteor.call('getCities', template.selectedCountry.get(), (err, ret) => {
            if (!err) {
                template.cities.set(ret)
            }
            else {
                console.log(err)
            }
        })
    })
    Meteor.call('getCountries', (err, ret) => {
        if (!err) {
            template.countries.set(ret)
        }
        else {
            console.log(err)
        }
    })
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
            if (event.target.value && event.target.value != '') {
                template.labels.set(template.labels.get().concat(event.target.value.toLowerCase()));
            }
            event.target.value = '';
        }
    },
    'focusout #inputStartDate': function(event, template) {
        DateUtil.toggleEndDate(template.startDateSet);
        if(template.startDateSet && template.startDateChanged) {
            DateUtil.setMinEndDate();
            DateUtil.setDefaultEndDate();
        }
    },
    'keyup input': function(e,t) {
        t.errors.delete(e.target.name)
    },
    'focus .form-control': (event, template) => {
        template.alreadyPresent.set(false)
    },
    'change #selectCountry': function(e, t) {
        t.selectedCountry.set(e.target.value)
    }
})

Template.addEditEvent.helpers({
    labels() {
        return Template.instance().labels.get()
    },
    reactiveLabels () {
        return Template.instance().labels
    },
    error(name) {
        return Template.instance().errors.get(name)
    },
    countries() {
        return Template.instance().countries.get()
    },
    cities() {
        return Template.instance().cities.get()
    },
    isAlreadyPresent() {
        return Template.instance().alreadyPresent.get()
    }
});