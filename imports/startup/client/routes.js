import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/all-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';
import '/imports/ui/pages/my-events.js';
import '/imports/ui/pages/edit-event.js';
import '/imports/ui/components/common.js';
import '/imports/ui/pages/forgot-pass.js';
import '/imports/ui/pages/reset-pass.js';
import '/imports/ui/pages/profile.js';

var defaultQueries =  {
    defaults : {
        'home': 'date=today',
        'myEvents' : 'future=true'
    },
    get (context) {
        return context.route._path + '?' + this.defaults[context.route.getName()];
    }
}

function isLoggedInAsOrganizer() {
    return Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'organizer');
}

function hasVerifiedEmail() {
    return Meteor.user() && Meteor.user().emails[0].verified;
}


function setQuery(context) {
    if (!Object.keys(context.params.query).length) {
        context.redirect(defaultQueries.get(context));
    }
    else {
        Session.set('query', context.params.query);
        context.next();
    }
}

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'allEvents',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('events', this.params.query);
    },
    onBeforeAction () {
        setQuery(this);
    },
    action () {
        this.render();
    }
});

Router.route('/verify-email/:token', {
    name: 'verifyEmail',
    action () {
        Accounts.verifyEmail(this.params.token, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                console.log("Email verified");
            }
            this.redirect('home');
        });
    }
});

Router.route('/profile', {
    name: 'profile',
    template: 'profile',
    loadingTemplate: 'loading',
    onBeforeAction () {
        if (!Meteor.user())
            this.render('needLogInToViewProfile');
        else
            this.next();
    },
    data () {
        if (Meteor.user()) {
            let user = Meteor.user();
            return {
                email: user.emails[0].address, 
                role: user.roles[0].toUpperCase(), 
                isOrganizer: user.profile.isOrganizer, 
                organizerName: user.profile.organizerName,
                isVerified: hasVerifiedEmail(), 
                isLinkedWithFacebook: user.profile.isLinkedWithFacebook
            };
        }
    }
});

Router.route('/forgot-pass', {
    name: 'forgot-pass',
    template: 'forgotPassword'
});

Router.route('/reset-pass/:token', {
    name: 'reset-pass',
    template: 'resetPassword',
    data () {
        return {token: this.params.token}
    }
});

Router.route('/add', {
    name: 'add',
    template: 'addEvent',
    onBeforeAction () {
        if (!isLoggedInAsOrganizer())
            this.render("needLogInAsOrgToAdd");
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
    waitOn () {
        return Meteor.subscribe('my-events', this.params.query);
    },
    onBeforeAction () {
        if (isLoggedInAsOrganizer())
            setQuery(this);
        else
            this.render("needLogInAsOrgToAdd");
    },
    action () {
        this.render();
    }
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('one-event', this.params._id);
    },
    data () {
        return Events.findOne({_id: this.params._id});
    },
    action () {
        this.render();
    }
});

Router.route('/event/:_id/edit', {
    name: 'edit',
    template: 'editEvent',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('one-event', this.params._id);
    },
    data () {
        return Events.findOne({_id: this.params._id});
    },
    action () {
        this.render();
    }
});
