export const Events = new Mongo.Collection('events');

EventSchema = new SimpleSchema({
    // _id: {
    //     type: String
    // },
    name: {
        label: 'Event name',
        type: String,
        //max: 20,
        denyUpdate: true
    },
    country: {
        label: 'Event country',
        type: String,
        denyUpdate: true
    },
    city: {
        label: 'Event city',
        type: String,
        denyUpdate: true
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
        type: Date,
        custom() {
            if (this.value < this.field('startDate').value) {
                return 'badDate';
            }
            return true;
        }
    },
    description: {
        label: 'Event description',
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
        label: 'Event poster',
        type: String
    },
    validatedBy: {
        label: "Users that validated this event",
        type: [String],
        optional: true,
        defaultValue: []
    },
    invalidatedBy: {
        label: "Users that invalidated this event",
        type: [String],
        optional: true,
        defaultValue: []
    }
});

Events.attachSchema(EventSchema);