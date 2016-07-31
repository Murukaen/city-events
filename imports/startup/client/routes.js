//import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/all-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';
import '/imports/ui/pages/forgot-pass.js';
import '/imports/ui/pages/my-events.js';
import '/imports/ui/components/common.js';

function isLoggedInAsOrganizer() {
    return Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'organizer');
}

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'allEvents'
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

// Router.route('/myevents', {
//     name: 'myEvents',
//     template: 'myEvents',
//     onBeforeAction: function() {
//         if (isLoggedInAsOrganizer())
//             this.next();
//         else
//             this.render("needLogIn");
//     }
// });

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

// Router.route('/forgot', {
//     template: 'ForgotPassword'
// });
