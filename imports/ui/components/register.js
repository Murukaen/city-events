import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.register.onRendered(function() {
    var validator = $('.register').validate({
        submitHandler: function() {
            Accounts.createUser({
                email: $('.register #register-email').val(),
                password: $('.register #register-pass').val(),
                profile: {
                    isOrganizer: $(".register #register-organizer").is(":checked")
                }
            }, function(error) {
                if (error) {
                    if(error.reason == "Email already exists.") {
                        validator.showErrors({
                            email: "That email already belongs to a registered user."
                        });
                    }
                }
            });
        }
    });
});