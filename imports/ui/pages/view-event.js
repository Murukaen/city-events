import './view-event.html';
import './view-event.css';

Template.viewEvent.events({
    'click #voteUp': function(event, template) {
        Meteor.call('voteUpEvent', template.data._id, (err) => {
            if (err) 
                console.log(err);
        });
    },
    'click #voteDown': function(event, template) {
        Meteor.call('voteDownEvent', template.data._id, (err) => {
            if (err) 
                console.log(err);
        });
    }
});

Template.viewEvent.helpers({
    hasVotedUp() {
        return Template.instance().data.validatedBy.includes(Meteor.userId());
    },
    hasVotedDown() {
        return Template.instance().data.invalidatedBy.includes(Meteor.userId());
    }
});
