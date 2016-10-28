//import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/all-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';
import '/imports/ui/pages/my-events.js';
import '/imports/ui/pages/edit-event.js';
import '/imports/ui/components/common.js';

function isLoggedInAsOrganizer() {
    return Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'organizer');
}

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'allEvents',
    subscriptions: function() {
        return Meteor.subscribe('events', this.params.query.search);
    }
});

Router.route('/add', {
    name: 'add',
    template: 'addEvent',
    onBeforeAction: function() {
        if (isLoggedInAsOrganizer())
            this.next();
        else
            this.render("needLogIn");
    }
});

Router.route('/myevents', {
    name: 'myEvents',
    template: 'myEvents',
    onBeforeAction: function() {
        if (isLoggedInAsOrganizer())
            this.next();
        else
            this.render("needLogIn");
    }
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    data: function() {
        return Events.findOne({_id: this.params._id});
    }
});

Router.route('/event/:_id/edit', {
    name: 'edit',
    template: 'editEvent',
    subscriptions: function() {
        return Meteor.subscribe('events');
    },
    data: function() {
        return Events.findOne({_id: this.params._id});
    },
    action: function () {
        if (this.ready()) {
          this.render();
        }
        else {
            this.render('loading');
        }
    }
})
