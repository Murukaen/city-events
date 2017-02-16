Events = new Mongo.Collection('events'); // TODO export const

EventSchema = new SimpleSchema({
    name: {
        label: 'Event name',
        type: String,
        unique: true,
        max: 20,
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
        label: 'Event organizer name',
        type: String
    }
});

Events.attachSchema(EventSchema);