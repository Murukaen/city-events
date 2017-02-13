//import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/all-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';
import '/imports/ui/pages/my-events.js';
import '/imports/ui/pages/edit-event.js';
import '/imports/ui/components/common.js';
import '/imports/ui/pages/forgot-pass.js';
import '/imports/ui/pages/reset-pass.js';

function isLoggedInAsOrganizer() {
    return Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'organizer');
}

function hasVerifiedEmail() {
    return Meteor.user() && Meteor.user().emails[0].verified;
}

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'allEvents',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('events', this.params.query);
    },
    onBeforeAction: function () {
        if (!Object.keys(this.params.query).length) {
            this.redirect('/?date=today');
        }
        else {
            Session.set('query', this.params.query);
            this.next();
        }
    },
    action: function() {
        this.render();
    }
});

Router.route('/forgot-pass', {
    name: 'forgot-pass',
    template: 'forgotPassword'
});

Router.route('/reset-pass/:token', {
    name: 'reset-pass',
    template: 'resetPassword',
    data: function() {
        return {token: this.params.token}
    }
});

Router.route('/add', {
    name: 'add',
    template: 'addEvent',
    onBeforeAction: function() {
        if (!isLoggedInAsOrganizer())
            this.render("needLogIn");
        else if (!hasVerifiedEmail())
            this.render("needEmailVerification");
        else
            this.next();
    }
});

Router.route('/myevents', {
    name: 'myEvents',
    template: 'myEvents',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('my-events');
    },
    onBeforeAction: function() {
        if (isLoggedInAsOrganizer())
            this.next();
        else
            this.render("needLogIn");
    },
    action: function() {
        this.render();
    }
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('one-event', this.params._id);
    },
    data: function() {
        return Events.findOne({_id: this.params._id});
    },
    action: function() {
        this.render();
    }
});

Router.route('/event/:_id/edit', {
    name: 'edit',
    template: 'editEvent',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('one-event', this.params._id);
    },
    data: function() {
        return Events.findOne({_id: this.params._id});
    },
    action: function() {
        this.render();
    }
});
