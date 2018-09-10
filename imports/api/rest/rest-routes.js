import {Events} from '/imports/api/events/events'
import {checkEventNameIsPresent} from '/imports/api/events/event-methods'

Picker.route('/api', function(params, req, res, next) {
    res.end("It works")
})

Picker.route('/api/insert', function(params, req, res, next) {
    let body = ""
    req.on('readable', function() {
        let buffer = req.read()
        if (buffer) {
            body += buffer
        }
    })
    req.on('end', Meteor.bindEnvironment(function() {
        console.log("[api:insert] Received data:" + body)
        let data = JSON.parse(body)
        if (!checkEventNameIsPresent(data.name)) {
            data.startDate = new Date(data.startDate)
            data.endDate = new Date(data.endDate)
            Events.insert(data)
            console.log("[api:insert] Added")
            res.end("[success] Added")
        }
        else {
            console.log("[api:insert] Err: Name already present")
            res.end("[err] Name already present")
        }
    }))
})