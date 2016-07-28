import './show-events.html';
import './show-events.css';
//import {Events} from '/imports/api/events/events.js';

Template.showEvents.onCreated(function () {
    let template = Template.instance();
    template.searchQuery = new ReactiveVar();
    template.autorun( () => {
        console.log("showEvents autorun");
        template.subscribe('events', template.searchQuery.get());
    });
});

/* EVENTS */
Template.showEvents.events({
    'click .event-box': function() {
        Router.go('view', {_id: this._id});
    },
    'keypress [name=search]': function(event, template) {
        let value = event.target.value.trim();
        if (event.key === 'Enter') {
            template.searchQuery.set(value);
        }
    }
});

/* HELPERS */
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
        return chunks;
    },
    // 'event': function() {
    //     return Events.find();
    // },
    'formatDate': function(date) {
        return moment(date).format("DD-MM-YYYY HH:mm");
    }
});