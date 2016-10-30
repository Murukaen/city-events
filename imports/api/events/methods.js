import './events.js';
//import {Events} from './events.js';

Meteor.methods({
    'addEvent': function(data, cbDone) {
        //TODO check
        Events.insert(data,cbDone);
    },
    'updateEvent': function(data, cbDone) {
        // TODO check ownership
        Events.update({_id: data._id}, {$set: data}, cbDone);
    },
    'test': function() {
        console.log("server test");
    }
})
