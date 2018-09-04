import '../components/show-events.js'
import '../helpers/query.js'

import './all-events.html'
import './all-events.css'

import {Events} from '/imports/api/events/events.js'

Template.allEvents.onCreated(function () {
    let template = Template.instance();
    let currentLabel = Session.get('query').label;
    template.labels = new Labels(currentLabel ? [currentLabel] : []);
    template.autorun(function () {
        Query.filter('search', 'label', template.labels.getLabels()[0]);
    });
    template.allLabels = Array.from(Events.find().fetch()
            .map((event) => event.labels)
            .reduce((set, arr) => new Set(Array.from(set).concat(arr)), new Set()))
    template.countries = new ReactiveVar();
    Meteor.call('getCountries', (err, ret) => {
        if (!err) {
            template.countries.set(ret)
        }
        else {
            console.log(err)
        }
    })
    template.cities = new ReactiveVar();
    let currentCountry = Session.get('query').country
    if (currentCountry) {
        Meteor.call('getCities', currentCountry, (err, ret) => {
            if (!err) {
                template.cities.set(ret)
            }
            else {
                console.log(err)
            }
        })
    }
});

Template.allEvents.onRendered(function () {
    Meteor.typeahead.inject();
    Session.get('query').date &&
    $('#dateFilter').find('.selected').text(
        $('#dateFilter').find('[name=' + Session.get('query').date.trim() + ']').text())
    Session.get('query').country && 
        $('#countryFilter').find('.selected').text(Session.get('query').country.trim())
    Session.get('query').city && 
        $('#cityFilter').find('.selected').text(Session.get('query').city.trim())
});

Template.allEvents.events({
    'submit #searchForm': function(event, template) {
        event.preventDefault();
        let value = $('input[name=search]').val().toLowerCase();
        Template.instance().labels.addSingleLabel(value);
    },
    'click #dateFilter ul': function(event, template) {
        event.preventDefault();
        Query.filter('search', 'date', event.target.name);
    },
    'click #countryFilter ul': function(event, template) {
        event.preventDefault();
        Query.filter('search', 'country', event.target.name);
    },
    'click #cityFilter ul': function(event, template) {
        event.preventDefault();
        Query.filter('search', 'city', event.target.name);
    }
});

Template.allEvents.helpers({
    eventData() {
        return {
            events: Events.find({}).fetch(),
            clickRoute: 'view'
        }    
    },
    labels() {
        return Template.instance().labels; 
    },
    allLabels() {
        return Template.instance().allLabels
    },
    countries() {
        return Template.instance().countries.get()
    },
    cities() {
        return Template.instance().cities.get()
    }
});