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
    deleteEvent(eventId) {
        if (eventIsPostedByCurrentUser(eventId)) {
            Events.remove({_id: eventId});
        }
    },
    voteUpEvent(eventId) {
        if (!eventIsPostedByCurrentUser(eventId)) {
            let event = Events.findOne({_id: eventId});
            let userId = Meteor.userId();
            if (event && !event.validatedBy.includes(userId)) {
                Events.update({_id: eventId}, {$push: {validatedBy: userId}});
                Events.update({_id: eventId}, {$pull: {invalidatedBy: userId}});
                if (!this.isSimulation) {
                    const {UserManager} = require('/imports/api/users/server/user-manager');
                    UserManager.increaseScore(event.createdBy, userId);
                }
            }
        }
    },
    voteDownEvent(eventId) {
        if (!eventIsPostedByCurrentUser(eventId)) {
            let event = Events.findOne({_id: eventId});
            let userId = Meteor.userId();
            if (event && !event.invalidatedBy.includes(userId)) {
                Events.update({_id: eventId}, {$push: {invalidatedBy: userId}});
                Events.update({_id: eventId}, {$pull: {validatedBy: userId}});
                if (!this.isSimulation) {
                    const {UserManager} = require('/imports/api/users/server/user-manager');
                    UserManager.decreaseScore(event.createdBy, userId);
                }
            }
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
