Meteor.publish('events', function(label) {
    let query = {};
    if (label) {
        query = {
            labels: label
        }
    }
    return Events.find(query);
});