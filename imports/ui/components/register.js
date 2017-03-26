import './register.html';

Template.register.onCreated(function() {
    this.isOrganizer = new ReactiveVar(false);
});

Template.register.onRendered(function() {
    const self = this;
    var validator = $('.register').validate({
        submitHandler () {
            Accounts.createUser({
                email: $('.register #register-email').val(),
                password: $('.register #register-pass').val(),
                profile: {
                    isOrganizer: self.isOrganizer.get(),
                    organizerName: $('.register #register-organizer-name').val()
                }
            }, function(error) {
                if (error) {
                    if(error.reason == "Email already exists.") {
                        validator.showErrors({
                            email: "That email already belongs to a registered user."
                        });
                    }
                }
                else {
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
    },
    'click #register-organizer': function(event, template) {
        template.isOrganizer.set($(".register #register-organizer").is(":checked"))
    }
});

Template.register.helpers({
    isOrganizer () {
        return Template.instance().isOrganizer.get();
    }
})
