import './routes'
import '../../collections/events/events' // TODO: dev
import '../../collections/cities/cities' // TODO: dev

Meteor.startup(() => {
    sAlert.config({
        effect: 'scale',
        timeout: 2500,
        position: 'bottom-right'
    })
})