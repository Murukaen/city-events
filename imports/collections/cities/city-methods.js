import {Cities} from './cities'

Meteor.methods({
    getCountries() {
        return Cities.find({}, {fields: {country: 1}}).fetch().map(e => e.country)
    },
    getCities(country) {
        if (country) {
            return Cities.findOne({country}, {fields: {cities: 1}}).cities
        }
        return []
    }
})