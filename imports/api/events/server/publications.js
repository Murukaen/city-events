function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getStartOfCurrentWeek() {
    let date = new Date();
    let day = date.getDay() || 7;
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}

function setDateOnQuery(startDate, endDate, query) {
    query.startDate = {$gte: startDate, $lte: endDate};
}

function CrietriaParser(criteria) {
    this.addLabel = function (query) {
        if (criteria.label) {
            query.labels = criteria.label;
        }
        if (criteria.date) {
            let startDate = new Date();
            let endDate = new Date();
            switch(criteria.date) {
                case 'today': 
                    startDate.setHours(0,0,0,0);
                    endDate.setHours(23,59,59,999);
                    break;
                case 'week':
                    startDate = getStartOfCurrentWeek();
                    endDate = addDays(startDate, 7);
                    break;
                case 'month':
                    // TODO
                    break;
            }
            setDateOnQuery(startDate, endDate, query);
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