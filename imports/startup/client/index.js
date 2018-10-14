import './routes'
import {Location} from '/imports/lib/location'
import '../../collections/events/events' // TODO: dev
import '../../collections/cities/cities' // TODO: dev

Meteor.startup(() => {
    sAlert.config({
        effect: 'scale',
        timeout: 2500,
        position: 'bottom-right'
    })
})

Accounts.onLogin((data) => {
    Location.updateCountryCitySession()
})