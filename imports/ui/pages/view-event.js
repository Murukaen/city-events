import './view-event.html';
import './view-event.css';

Template.viewEvent.events({
    'click #voteUp': function(event, template) {
        Meteor.call('voteUpEvent', template.data._id, (err) => {
            if (err) 
                console.log(err);
        });
    }
})
