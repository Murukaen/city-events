import './show-events.html';
import './show-events.css';

Template.showEvents.events({
    'click .event-box': function() {
        Router.go(Template.instance().data.eventData.clickRoute, {_id: this._id});
    }
});

Template.showEvents.helpers({
    'eventRows': function() {
        let all = this.eventData.events;
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
