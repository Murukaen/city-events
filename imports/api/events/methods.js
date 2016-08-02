import './events.js';
//import {Events} from './events.js';

Meteor.methods({
    'addEvent': function(data, cbDone) {
        //TODO check
        Events.insert(data,cbDone);
    },
    'test': function() {
        console.log("server test");
    }
})
