import './events.js';
//import {Events} from './events.js';

function eventIsOwnByCurrentUser(eventId) {
    if (Meteor.user()) {
        let event = Events.findOne({_id: eventId});
        let organizerName = Meteor.user().profile.organizerName;
        return (event && event.createdBy == organizerName);
    }
    return false;
}

Meteor.methods({
    'addEvent': function(data, cbDone) {
        Events.insert(data,cbDone);
    },
    'updateEvent': function(data, cbDone) {
        if (eventIsOwnByCurrentUser(data._id)) {
            Events.update({_id: data._id}, {$set: data}, cbDone);
        }
    },
    'sendVerificationLink': function() {
        if (Meteor.isServer) {
            let userId = Meteor.userId();
            if ( userId ) {
              return Accounts.sendVerificationEmail( userId );
            }
        }
    }
})
