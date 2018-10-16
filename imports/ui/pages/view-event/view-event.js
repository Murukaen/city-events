import './view-event.html'
import './view-event.css'

Template.viewEvent.events({
    'click #vote-up': function(event, template) {
        Meteor.call('voteUpEvent', template.data._id, (err) => {
            if (err) {
                if (err.error == 'cant-vote-own-event') {
                    sAlert.warning("Cannot upvote own event")
                } else {
                    console.log(err)
                }
            }
        })
    },
    'click #vote-down': function(event, template) {
        Meteor.call('voteDownEvent', template.data._id, (err) => {
            if (err) {
                if (err.error == 'cant-vote-own-event') {
                    sAlert.warning("Cannot downvote own event")
                } else {
                    console.log(err)
                }
            }
        })
    },
    'click #go-back': function(event, template) {
        history.back()
    }
})

Template.viewEvent.helpers({
    hasVotedUp() {
        return Template.instance().data.validatedBy.includes(Meteor.userId())
    },
    hasVotedDown() {
        return Template.instance().data.invalidatedBy.includes(Meteor.userId())
    }
})
