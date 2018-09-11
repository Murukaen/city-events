import './pick-country.html'
import { Cities } from '../../api/cities/cities'

Template.pickCountry.events({
    'click #countryFilter ul': function(event, template) {
        event.preventDefault();
        Router.go('pickCity', {country: event.target.name})
    },
})

Template.pickCountry.helpers({
    countries() {
        return Cities.find({}).fetch()
    }
})