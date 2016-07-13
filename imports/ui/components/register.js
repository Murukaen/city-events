import './register.html';

Template.register.events({
    'submit form': function(event, template) {
        event.preventDefault();
        Accounts.createUser({
            email: template.find("#register-email").value,
            password: template.find("#register-email").value,
            profile: {
                isOrganizer: template.$("#register-organizer").is(":checked")
            }
        }, function(error) {
            if (error) {
                console.log(error.reason);
            }
            else {
                // Router.go('home');
            }
        });
    }
});