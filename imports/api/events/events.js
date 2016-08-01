Events = new Meteor.Collection('events'); // TODO export const

EventSchema = new SimpleSchema({
    name: {
        label: 'Event name',
        type: String
    },
    location: {
        label: 'Event location',
        type: String
    },
    startDate: {
        label: 'Event start datetime',
        type: String
    },
    endDate: {
        label: 'Event end datetime',
        type: String
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