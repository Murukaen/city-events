import './show-events.html';
import './show-events.css';

MAX_NAME_SIZE = 40
MAX_LOCATION_SIZE = 25

function shorten(str, size) {
    if (str.length <= size) {
        return str
    }
    return str.substr(0, size) + "..."
}

Template.showEvents.onCreated(function () {
    this.popularLabels = new ReactiveVar([])
    if (this.data.context == 'all') {
        Meteor.call('getPopularLabels', (err, data) => {
            if (!err) {
                this.popularLabels.set(data.map(o => o.label))
            }
            else {
                console.log(err)
            }
        })
    }
})

Template.showEvents.events({
    'click .event-box': function() {
        let route = Template.instance().data.eventData.clickRoute
        // cannot edit past event, default to 'view'
        if (this.endDate < new Date()) {
            route = 'view'
        }
        Router.go(route, {_id: this._id});
    }
});

Template.showEvents.helpers({
    eventRows () {
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
    },
    popularLabels () {
        return Template.instance().popularLabels.get()
    }
});

Template.eventCell.helpers({
    shortenName (name) {
        return shorten(name, MAX_NAME_SIZE)
    },
    shortenLocation (location) {
        return shorten(location, MAX_LOCATION_SIZE)
    },
    showDate () {
        let startDate = moment(Template.instance().data.startDate)
        let endDate = moment(Template.instance().data.endDate)
        let date = startDate.format("DD-MM-YYYY HH:mm")
        if (endDate.isAfter(startDate, 'day')) {
            date += " to " + endDate.format("DD-MM-YYYY HH:mm")
        } else {
            date += " - " + endDate.format("HH:mm")
        }
        return date;
    }
})
