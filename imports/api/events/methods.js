import './events.js';
//import {Events} from './events.js';

Meteor.methods({
    'addEvent': function(data, cbDone) {
        console.log("Method addEvent:", data);
        //TODO check
        Events.insert({
            name: data.name,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            imgUrl: data.imgUrl,
            labels: data.labels,
            createdBy: data.createdBy
        },
            cbDone
        );
    },
    'test': function() {
        console.log("server test");
    }
})
