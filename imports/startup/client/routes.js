//import {Events} from '/imports/api/events/events.js';
import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/show-events.js';
import '/imports/ui/pages/add-event.js';
import '/imports/ui/pages/view-event.js';
import '/imports/ui/pages/register.js';
import '/imports/ui/pages/login.js';

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'showEvents'
});

Router.route('/add', {
    name: 'add',
    template: 'addEvent'
});

Router.route('/event/:_id', {
    name: 'view',
    template: 'viewEvent',
    data: function() {
        return Events.findOne({_id: this.params._id});
    }
});

Router.route('/register');

Router.route('/login');