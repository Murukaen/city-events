import {Events} from './events.js';

function eventIsPostedByCurrentUser(eventId) {
    if (Meteor.user()) {
        let event = Events.findOne({_id: eventId});
        return (event && event.createdBy == Meteor.userId());
    }
    return false;
}

function checkEventNameIsPresent(name) {
    return name && Events.findOne({name: name}) !== undefined;
}

Meteor.methods({
    updateEvent(data, cbDone) {
        if (eventIsPostedByCurrentUser(data._id)) {
            Events.update({_id: data._id}, {$set: data}, cbDone);
        }
    },
    deleteEvent(id) {
        if (eventIsPostedByCurrentUser(id)) {
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
            if (!this.isSimulation) {
                const {UserManager} = require('/imports/api/users/server/user-manager');
                UserManager.increaseScore();
            }
        }
    }   
});
