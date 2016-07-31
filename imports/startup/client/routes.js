//import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/show-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'showEvents'
});

Router.route('/add', {
    name: 'add',
    template: 'addEvent',
    onBeforeAction: function() {
        if (Meteor.userId())
            this.next();
        else
            this.render("needLogIn");
    }
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    subscriptions: function() {
        return Meteor.subscribe('events');
    },
    data: function() {
        return Events.findOne({_id: this.params._id});
    }
});