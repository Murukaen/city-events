import './add-event.html';
import './add-event.css'
import '/imports/api/events/methods.js';
//import {Images} from '/imports/api/images/images.js'; // TODO create method

function displayImage(imgObj) {
    var cursor = Images.find(imgObj._id);
    var liveQuery = cursor.observe({
        changed: function(newImage, oldImage) {
          if (newImage.url() !== null) {
            liveQuery.stop();
            $('#droppedImg').find('img').attr('src', newImage.url());
            $('#imgDropZone').attr('imgUrl', newImage.url());
            $('#imgDropZone').addClass('hide');
          }
        }
    });       
}

Template.addEvent.onRendered(function() {
        $('.datetimepicker').datetimepicker({
            defaultDate: new Date(),
            format: "DD-MM-YYYY HH:mm"
        });
        GoogleMaps.load({
            key: 'AIzaSyBY0lDEE8uNafAydB8sJlj3SMKZQ1rr4Ls',
            libraries: 'places'
        });
        this.autorun(function () {
            if (GoogleMaps.loaded()) {
                $("#inputLocation").geocomplete({
                    map: '#map'
                });
            }
        });
});

Template.addEvent.events({
    'submit form': function(event) {
        event.preventDefault();
        Meteor.call('addEvent', event.target.name.value, event.target.location.value, event.target.date.value, $('#imgDropZone').attr('imgUrl'), function () {
            Router.go('home');
        });
    },
    'dropped #imgDropZone': function(event) {
        FS.Utility.eachFile(event, function(file) {
            Images.insert(file, function (err, fileObj) {
                if (err){
                    console.log(err);
                } else {
                    displayImage(fileObj);
                }
            });
         });
    }
});

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
    }
})