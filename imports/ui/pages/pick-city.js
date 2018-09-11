import './pick-city.html'
import { Cities } from '../../api/cities/cities'

Template.pickCity.events({
    'click #cityFilter ul': function(event, template) {
        event.preventDefault();
        Router.go('search', {country: Router.current().params.country, city: event.target.name})
    },
})

Template.pickCity.helpers({
    cities() {
        return Cities.findOne({}).cities
    }
})