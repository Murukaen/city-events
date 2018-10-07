import {DateUtils} from '/imports/lib/date'
import {Events} from '/imports/collections/events/events'
import {Cities} from '/imports/collections/cities/cities'

var MongoQuery = function(query) {
    query = query || {}
    this.setEndDateLowerLimit = function(lowerLimit) {
        query.endDate = query.endDate || {}
        query.endDate['$gte'] = lowerLimit
    }
    this.setEndDateUpperLimit = function(upperLimit) {
        query.endDate = query.endDate || {}
        query.endDate['$lte'] = upperLimit
    }
};

function CriteriaParser(criteria, query) { 
    this.addLabel = () => {
        if (criteria.label) {
            query.labels = criteria.label
        }
    }
    this.addDate = () => {
        if (criteria.date) {
            let now = new Date()
            let upper = new Date(now)   
            switch(criteria.date) {
                case 'today': 
                    upper.setHours(23,59,59,999)
                    break;
                case 'week':
                    ({endDate: upper} = DateUtils.getStartAndEndOfCurrentWeek())
                    break;
                case 'month':
                    ({endDate: upper} = DateUtils.getStartAndEndOfCurrentMonth())
                    break;
                case 'year':
                    ({endDate: upper} = DateUtils.getStartAndEndOfCurrentYear())
                    break;
            }
            query['$or'] = [{startDate: {'$lte': now}, endDate: {'$gt': now}}, 
                {startDate: {'$gt': now, '$lt': upper}}]
        }  
    }
    this.addFuture = () => {
        if (criteria.past !== "true") {
            new MongoQuery(query).setEndDateLowerLimit(new Date())
        }
        if (criteria.future !== "true") {
            new MongoQuery(query).setEndDateUpperLimit(new Date())
        }
    }
}

Meteor.publish('events', function(country, city, criteria) {
    let query = {}
    if (criteria) {
        let parser = new CriteriaParser(criteria, query)
        parser.addLabel()
        parser.addDate()
        country && (query.country = country)
        city && (query.city = city)
    }
    query.staging = false
    return Events.find(query)
});

Meteor.publish('my-events', function(criteria) {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId)
        let query = {createdBy: this.userId}
        new CriteriaParser(criteria, query).addFuture()
        return Events.find(query)
    }
    return this.ready()
});

Meteor.publish('one-event', function(eventId) {
    if (eventId) {
        return Events.find({_id:eventId})
    }
    return this.ready()
});

Meteor.publish('countries', function() {
    return Cities.find({}, {country: 1})
})

Meteor.publish('cities', function(country) {
    return Cities.find({country}, {cities: 1})
})