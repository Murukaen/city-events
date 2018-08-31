import './register.html';
import {Profile} from '/imports/lib/profile';

Template.register.onRendered(function() {
    const self = this;
    var validator = $('.register').validate({
        submitHandler () {
            Accounts.createUser({
                email: $('.register #register-email').val(),
                password: $('.register #register-pass').val(),
                profile: {
                    points: 0
                }
            }, function(error) {
                if (error) {
                    if(error.reason == "Email already exists.") {
                        validator.showErrors({
                            email: "That email already belongs to a registered user."
                        });
                    }
                }
                else if (!Profile.isDev()) {
                    Meteor.call( 'sendVerificationLink', ( error, response ) => {
                      if ( error ) {
                        console.log('Verification error', error.reason);
                      } else {
                        console.log('Verification sent successfully');
                        // TODO alert user
                      }
                    });
                }
            });
        }
    });
});

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});
