import './add-event.html';
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

Template.addEvent.rendered = function() {
        $('.datetimepicker').datetimepicker({
            defaultDate: new Date(),
            format: "DD-MM-YYYY HH:mm"
        });
    };
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
                     // handle success depending what you need to do
                    // var imageUrl = "/cfs/files/images/" + fileObj._id;
                    // console.log("Added image:", imageUrl);
                    displayImage(fileObj);
                }
            });
         });
    }
});