import './events.js';
//import {Events} from './events.js';

Meteor.methods({
    'addEvent': function(name, location, date, imgUrl, cbDone) {
        console.log("Method: addEvent", name, location, date, imgUrl);
        //TODO check
        Events.insert({
            name: name,
            location: location,
            date: date,
            imgUrl: imgUrl
        },
            cbDone
        );
        console.log("---");
    },
    'test': function() {
        console.log("server test");
    }
})
