Events = new Meteor.Collection('events'); // TODO export const

Events.allow({
    insert: () => {
        return true;
    },
    update: () => {
        return true;
    },
    remove: () => {
        return true;
    }
});

EventSchema = new SimpleSchema({
    name: {
        label: 'Event name',
        type: String,
        max: 20
    },
    location: {
        label: 'Event location',
        type: String
    },
    startDate: {
        label: 'Event start datetime',
        type: Date
    },
    endDate: {
        label: 'Event end datetime',
        type: Date
    },
    imgUrl: {
        label: 'Event image url',
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    labels: {
        label: 'Event labels',
        type: [String],
        optional: true
    },
    createdBy: {
        label: 'Event organizer',
        type: String
    }
});

Events.attachSchema(EventSchema);