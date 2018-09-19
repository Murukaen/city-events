import {Events} from './events.js'

function eventIsPostedByCurrentUser(eventId) {
    if (Meteor.user()) {
        let event = Events.findOne({_id: eventId});
        return (event && event.createdBy == Meteor.userId());
    }
    return false;
}

function checkEventIdIsPresent(id) {
    return id && Events.findOne({_id: id}) !== undefined
}

function constructId(data) {
    return `${data.country}:${data.city}:${data.name}:${data.startDate}`
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
            if (event) {
                if (!event.validatedBy.includes(userId)) {
                    Events.update({_id: eventId}, {$push: {validatedBy: userId}});
                    let hasInvalidatedBefore = event.invalidatedBy.includes(userId);
                    if (hasInvalidatedBefore) {
                        Events.update({_id: eventId}, {$pull: {invalidatedBy: userId}});
                    }
                    if (!this.isSimulation) {
                        const {UserManager} = require('/imports/api/users/server/user-manager');
                        UserManager.increaseScore(event.createdBy, userId);
                        if (hasInvalidatedBefore) {
                            UserManager.increaseScore(event.createdBy, userId);
                        }
                    }
                }
                else {
                    Events.update({_id: eventId}, {$pull: {validatedBy: userId}});
                    if (!this.isSimulation) {
                        const {UserManager} = require('/imports/api/users/server/user-manager');
                        UserManager.decreaseScore(event.createdBy, userId);
                    }
                }
            }    
        }
    },
    voteDownEvent(eventId) {
        if (!eventIsPostedByCurrentUser(eventId)) {
            let event = Events.findOne({_id: eventId});
            let userId = Meteor.userId();
            if (event) {
                if (!event.invalidatedBy.includes(userId)) {
                    Events.update({_id: eventId}, {$push: {invalidatedBy: userId}});
                    let hasValidatedBefore = event.validatedBy.includes(userId);
                    if (hasValidatedBefore) {
                        Events.update({_id: eventId}, {$pull: {validatedBy: userId}});
                    }
                    if (!this.isSimulation) {
                        const {UserManager} = require('/imports/api/users/server/user-manager');
                        UserManager.decreaseScore(event.createdBy, userId);
                        if (hasValidatedBefore) {
                            UserManager.decreaseScore(event.createdBy, userId);
                        }
                    }
                }
                else {
                    Events.update({_id: eventId}, {$pull: {invalidatedBy: userId}});
                    if (!this.isSimulation) {
                        const {UserManager} = require('/imports/api/users/server/user-manager');
                        UserManager.increaseScore(event.createdBy, userId);
                    }
                }
            }
        }
    }
});

addEvent = new ValidatedMethod({
    name: 'addEvent',
    validate: Events.simpleSchema().validator(),
    run(data) {
        let id = constructId(data)
        if (checkEventIdIsPresent(id)) {
            throw new ValidationError("ALREADY_PRESENT")
        } else {
            data._id = id
            Events.insert(data)
            if (!this.isSimulation) {
                const {UserManager} = require('/imports/api/users/server/user-manager')
                UserManager.increaseScore()
            }
        }
    }   
})