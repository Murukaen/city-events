import './show-events.html';
import './show-events.css';
//import {Events} from '/imports/api/events/events.js';

Template.showEvents.helpers({
    events: function() {
        all = Events.find({}).fetch();
        chunks = [];
        size = 4;
        while (all.length > size) {
            chunks.push({ row: all.slice(0, size)});
            all = all.slice(size);
        }
        if (all.length > 0)
            chunks.push({row: all});
        console.log(chunks);
        return chunks;
    },
    // 'event': function() {
    //     return Events.find();
    // },
    'formatDate': function(date) {
        return moment(date).format("DD-MM-YYYY HH:mm");
    }
});

Template.showEvents.events({
    'click .event-box': function() {
        console.log("Click");
        Router.go('view', {_id: this._id});
    }
});