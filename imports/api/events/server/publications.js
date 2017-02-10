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

function getStartAndEndOfCurrentMonth() {
    let date = new Date();
    let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {startDate: startDate, endDate: endDate};
}

function setDateOnQuery(startDate, endDate, query) {
    query.startDate = {$gte: startDate, $lte: endDate};
}

function CrietriaParser(criteria) {
    this.addLabel = function (query) {
        if (criteria.label) {
            query.labels = criteria.label;
        }
    };
    this.addDate = function(query) {
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
                    let currentMonthBounds = getStartAndEndOfCurrentMonth();
                    startDate = currentMonthBounds.startDate;
                    endDate = currentMonthBounds.endDate;
                    break;
            }
            setDateOnQuery(startDate, endDate, query);
        }  
    };     
}

Meteor.publish('events', function(criteria) {
    let query = {};
    if (criteria) {
        let parser = new CrietriaParser(criteria);
        parser.addLabel(query);
        parser.addDate(query);
    }
    return Events.find(query);
});

Meteor.publish('my-events', function() {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        return Events.find({createdBy: user.profile.organizerName});
    }
    return this.ready();
});

Meteor.publish('one-event', function(eventId) {
    if (eventId) {
        return Events.find({_id:eventId});
    }
    return this.ready();
});