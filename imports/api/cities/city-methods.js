import {Cities} from './cities'

Meteor.methods({
    getCountries() {
        return Cities.find({}, {country: 1}).fetch();
    },
    getCities(country) {
        if (country) {
            return Cities.findOne({country}, {cities: 1}).cities;
        }
        return [];
    }
})