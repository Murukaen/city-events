import {Events} from './events.js';

function eventIsOwnByCurrentUser(eventId) {
    if (Meteor.user()) {
        let event = Events.findOne({_id: eventId});
        let organizerName = Meteor.user().profile.organizerName;
        return (event && event.createdBy == organizerName);
    }
    return false;
}

function checkEventNameIsPresent(name) {
    return name && Events.findOne({name: name}) !== undefined;
}

Meteor.methods({
    updateEvent(data, cbDone) {
        if (eventIsOwnByCurrentUser(data._id)) {
            Events.update({_id: data._id}, {$set: data}, cbDone);
        }
    },
    deleteEvent(id) {
        if (eventIsOwnByCurrentUser(id)) {
            Events.remove({_id: id});
        }
    }
});

addEvent = new ValidatedMethod({
    name: 'addEvent',
    validate: Events.simpleSchema().validator(),
    run(data) {
        if (checkEventNameIsPresent(data.name)) {
            throw new ValidationError([{name: 'name', type: 'unique'}]);
        }
        else {
            Events.insert(data);
        }
    }   
});
