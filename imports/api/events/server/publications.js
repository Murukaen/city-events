function CrietriaParser(criteria) {
    this.addLabel = function (query) {
        if (criteria.label) {
            query.labels = criteria.label;
        }
    }     
}

Meteor.publish('events', function(criteria) {
    let query = {};
    if (criteria) {
        let parser = new CrietriaParser(criteria);
        parser.addLabel(query);
    }
    return Events.find(query);
});