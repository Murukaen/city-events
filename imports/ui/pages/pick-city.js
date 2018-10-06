import './pick-city.html'
import { Cities } from '../../api/cities/cities'

Template.pickCity.onRendered(function () {
    if (Session.get('passwordReset')) {
        Session.set('passwordReset', false)
        sAlert.success("Password successfully reset")
    }
})

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