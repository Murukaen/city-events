import {Events} from '/imports/api/events/events'
import '/imports/api/events/event-methods'
import {Profile} from '/imports/lib/profile'

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
        data.startDate = new Date(data.startDate)
        data.endDate = new Date(data.endDate)
        data.staging = true
        if (Profile.isDev()) {
            data.staging = false
        }
        Meteor.call('addEvent', data, (err) => {
            if (!err) {
                console.log("[api:insert] Added")
                res.end("[success] Added")
            }
            else {
                console.log("[api:insert] Err: Event already present")
                res.end("[err] Event already present")
            }
        })
    }))
})