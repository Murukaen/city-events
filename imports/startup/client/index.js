import './routes'
import '../../api/events/events' // TODO: dev
import '../../api/cities/cities' // TODO: dev

Meteor.startup(() => {
    sAlert.config({
        effect: 'scale',
        timeout: 2500,
        position: 'top-right'
    })
})