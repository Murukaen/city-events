import './add-event.html';
import './add-event.css'
import '/imports/api/events/methods.js';
import '/imports/ui/components/labels.js';

function initValidator(template) {
    var validator = $('.event-setup').validate({
        rules: {
            name: {
                maxlength: 20
            }
        },
        submitHandler: function(event) {
            var data = {
                name: $('[name=name]').val(),
                location: $('[name=location]').val(),
                startDate: $('#start-date').data('DateTimePicker').date().toDate(),
                endDate: $('#end-date').data('DateTimePicker').date().toDate(),
                description: $('[name=description').val(),
                labels: template.labels.get(),
                createdBy: Meteor.user().profile.organizerName
            }
            Meteor.call('addEvent', data, () => {
                Router.go('myEvents');
            });
        }
    });
}

function initDateTimePickers() {
    $('#start-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
            minDate: new Date(),
            useCurrent: false
        })
        .on("dp.change", () => {
            var startDate = $('#start-date').data('DateTimePicker').date()
            $("#end-date").data('DateTimePicker').minDate(startDate);
        });
    $('#end-date')
        .datetimepicker({
            format: "DD-MM-YYYY HH:mm",
        })
        .on("dp.change", () => {
            var endDate = $('#end-date').data('DateTimePicker').date()
            $("#start-date").data('DateTimePicker').maxDate(endDate);
        });
}

function initGoogleMaps() {
    GoogleMaps.load({
        key: 'AIzaSyBY0lDEE8uNafAydB8sJlj3SMKZQ1rr4Ls',
        libraries: 'places'
    });
    Tracker.autorun(function () {
        if (GoogleMaps.loaded()) {
            $("#inputLocation")
                .geocomplete({
                    map: '#map'//,
                    // markerOptions: {
                    //     draggable: true
                    // }
                })
                .bind("geocode:result", function(event, result){
                    $('#map').show();
                    var map = $("#inputLocation").geocomplete("map");
                    google.maps.event.trigger(map, 'resize');
                    console.log(result.geometry.viewport);
                    map.panTo(result.geometry.location);
                    // map.setZoom(12);
                    // map.fitBounds(result.geometry.bounds);
                })
                .bind("geocode:error", function(event, result){
                    console.log("Geo error:", result);
                });
        }
    });
}

Template.addEvent.onCreated(() => {
    let template = Template.instance();
    template.labels = new ReactiveVar([]);
});

Template.addEvent.onRendered(function() {
    initValidator(Template.instance());
    initGoogleMaps();
    initDateTimePickers();
});

/* EVENTS */
Template.addEvent.events({
    'submit form': function(event) {
        event.preventDefault();
    },
    'keypress input[name="label"]': function(event, template) {
        if (event.key === 'Enter') {
            event.preventDefault();
            let labels = Template.instance().labels;
            labels.set(labels.get().concat(event.target.value));
            event.target.value = '';
        }
    }
});

/* HELPERS */
Template.addEvent.helpers({
    mapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
          // Map initialization options
          return {
            center: new google.maps.LatLng(-37.8136, 144.9631),
            zoom: 8
          };
        }
    },
    labels() {
        return Template.instance().labels.get(); 
    }
})