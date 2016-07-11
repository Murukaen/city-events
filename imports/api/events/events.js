Events = new Meteor.Collection('events'); // TODO export const

if (Meteor.isServer) {
    Meteor.publish('events', function() {
        return Events.find();
    });
}
else {
    Meteor.subscribe('events');
}