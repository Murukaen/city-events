import {DateUtils} from '/imports/lib/date.js';

var MongoQuery = function(query) {
    this.query = query || {};
    this.setStartDateLowerLimit = function(lowerLimit) {
        this.query.startDate = this.query.startDate || {};
        this.query.startDate['$gte'] = lowerLimit;
    };
    this.setStartDateUpperLimit = function(upperLimit) {
        this.query.startDate = this.query.startDate || {};
        this.query.startDate['$lte'] = upperLimit;
    };
    this.setStartDateLimits = function(lowerLimit, upperLimit) {
        this.setStartDateLowerLimit(lowerLimit);
        this.setStartDateUpperLimit(upperLimit);
    };
};

function CriteriaParser(criteria) { // TODO consider passing query in constructor
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
                    endDate.setHours(23,59,59,999);
                    break;
                case 'week':
                    ({endDate} = DateUtils.getStartAndEndOfCurrentWeek());
                    break;
                case 'month':
                    ({endDate} = DateUtils.getStartAndEndOfCurrentMonth());
                    break;
                case 'year':
                    ({endDate} = DateUtils.getStartAndEndOfCurrentYear());
                    break;
            }
            new MongoQuery(query).setStartDateLimits(startDate, endDate);
        }  
    };
    this.addFuture = function(query) {
        if (criteria.past !== "true") {
            new MongoQuery(query).setStartDateLowerLimit(new Date());
        }
        if (criteria.future !== "true") {
            new MongoQuery(query).setStartDateUpperLimit(new Date());
        }
    };
}

Meteor.publish('events', function(criteria) {
    let query = {};
    if (criteria) {
        let parser = new CriteriaParser(criteria);
        parser.addLabel(query);
        parser.addDate(query);
    }
    return Events.find(query);
});

Meteor.publish('my-events', function(criteria) {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        let query = {createdBy: user.profile.organizerName};
        new CriteriaParser(criteria)
            .addFuture(query);
        return Events.find(query);
    }
    return this.ready();
});

Meteor.publish('one-event', function(eventId) {
    if (eventId) {
        return Events.find({_id:eventId});
    }
    return this.ready();
});