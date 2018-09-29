import './pick-city.html'
import { Cities } from '../../api/cities/cities'

Template.pickCity.events({
    'change select': function(event, template) {
        let val = $(event.target).val()
        if (val != 'default') {
            Router.go('search', {country: Router.current().params.country, city: val})
        }
    }
})

Template.pickCity.helpers({
    cities() {
        return Cities.findOne({}).cities
    }
})