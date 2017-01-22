function CrietriaParser(criteria) {
    this.addLabel = function (query) {
        if (criteria.label) {
            query.labels = criteria.label;
        }
        if (criteria.date) {
            switch(criteria.date) {
                case 'today': 
                    let startDate = new Date();
                    startDate.setHours(0,0,0,0);
                    let endDate = new Date();
                    endDate.setHours(23,59,59,999);
                    query.startDate = {$gte: startDate, $lte: endDate};
                    break;
            }
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