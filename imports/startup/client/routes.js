import {Events} from '/imports/api/events/events'
import {Profile} from '/imports/lib/profile'
import '/imports/ui/layouts/app-body'
import '/imports/ui/pages/all-events'
import '/imports/ui/pages/add-event'
import '/imports/ui/pages/view-event'
import '/imports/ui/pages/my-events'
import '/imports/ui/pages/edit-event'
import '/imports/ui/components/common'
import '/imports/ui/pages/forgot-pass'
import '/imports/ui/pages/reset-pass'
import '/imports/ui/pages/profile'
import '/imports/ui/pages/pick-country'
import '/imports/ui/pages/pick-city'

var defaultQueries =  {
    defaults : {
        'search': 'date=today',
        'myEvents' : 'future=true'
    },
    get (context) {
        return context.url + '?' + this.defaults[context.route.getName()];
    }
}

function hasVerifiedEmail() {
    return Profile.isDev() || Meteor.user() && Meteor.user().emails[0].verified;
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
    action () {
        Session.set("country", false)
        Session.set("city", false)
        this.redirect('pickCountry')
    }
})

Router.route('/search', {
    name: 'pickCountry',
    template: 'pickCountry',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('countries')
    },
    onBeforeAction () {
        if (Session.get("country")) {
            if (Session.get("city")) {
                this.redirect("search", {country: Session.get("country"), city: Session.get("city")})
            } else {
                this.redirect("pickCity", {country: Session.get("country")})
            }
        }
        this.next()
    }
});

Router.route('/search/:country', {
    name: 'pickCity',
    template: 'pickCity',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('cities', this.params.country)
    },
    onBeforeAction () {
        Session.set("country", this.params.country)
        Session.set("city", false)
        this.next()
    }
})

Router.route('/search/:country/:city', {
    name: 'search',
    template: 'allEvents',
    loadingTemplate: 'loading',
    waitOn () {
        if (Object.keys(this.params.query).length) {
            return Meteor.subscribe('events', this.params.country, this.params.city, this.params.query);
        }
        return []
    },
    data () {
        return {
            country: this.params.country,
            city: this.params.city
        }
    },
    onBeforeAction () {
        Session.set("country", this.params.country)
        Session.set("city", this.params.city)
        setQuery(this)
    }
});

Router.route('/verify-email/:token', {
    name: 'verifyEmail',
    action () {
        Accounts.verifyEmail(this.params.token, (err) => {
            if (err) {
                console.error(err)
            }
            else {
                console.log("Email verified")
            }
            this.redirect('pickCountry')
        })
    }
})

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
                isVerified: hasVerifiedEmail(), 
                isLinkedWithFacebook: user.profile.isLinkedWithFacebook,
                isLinkedWithGoogle: user.profile.isLinkedWithGoogle,
                points: user.profile.points
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
        if (!hasVerifiedEmail())
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
        return Meteor.subscribe('my-events', this.params.query)
    },
    onBeforeAction () {
        setQuery(this)
    }
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('one-event', this.params._id)
    },
    data () {
        return Events.findOne({_id: this.params._id})
    },
    action () {
        this.render()
    }
})

Router.route('/event/:_id/edit', {
    name: 'edit',
    template: 'editEvent',
    loadingTemplate: 'loading',
    waitOn () {
        return Meteor.subscribe('one-event', this.params._id)
    },
    data () {
        return Events.findOne({_id: this.params._id})
    },
    action () {
        this.render()
    }
});
