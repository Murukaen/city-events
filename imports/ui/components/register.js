import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.register.onRendered(function() {
    $('.register').validate({
        submitHandler: function() {
            Accounts.createUser({
                email: $('.register #register-email').val(),
                password: $('.register #register-pass').val(),
                profile: {
                    isOrganizer: $(".register #register-organizer").is(":checked")
                }
            }, function(error) {
                if (error) {
                    console.log(error.reason);
                }
            });
        }
    });
});