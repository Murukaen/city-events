import './pick-country.html'
import { Cities } from '../../api/cities/cities'

Template.pickCountry.onRendered(function () {
    if (Session.get('passwordReset')) {
        Session.set('passwordReset', false)
        sAlert.success("Password successfully reset")
    }
})

Template.pickCountry.events({
    'change select': function(event, template) {
        let val = $(event.target).val()
        if (val != 'default') {
            Router.go('pickCity', {country: val})
        }
    }
})

Template.pickCountry.helpers({
    countries() {
        return Cities.find({}).fetch()
    }
})