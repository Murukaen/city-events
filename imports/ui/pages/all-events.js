import '../components/show-events.js';

import './all-events.html';
import './all-events.css';

//import {Events} from '/imports/api/events/events.js';

Template.allEvents.onCreated(function () {
    let template = Template.instance();
    template.searchQuery = new ReactiveVar();
    template.autorun( () => {
        template.subscribe('events', template.searchQuery.get());
    });
});

/* EVENTS */
Template.allEvents.events({
    'keypress [name=search]': function(event, template) {
        let value = event.target.value.trim();
        if (event.key === 'Enter') {
            template.searchQuery.set(value);
        }
    }
});

/* HELPERS */
Template.allEvents.helpers({
    'eventChunks': function() {
        let all = Events.find({}).fetch();
        let chunks = [];
        let size = 4;
        while (all.length > size) {
            chunks.push({ row: all.slice(0, size)});
            all = all.slice(size);
        }
        if (all.length > 0)
            chunks.push({row: all});
        return chunks;
    }
});