import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        Accounts.createUser({
            email: event.target.email.value,
            password: event.target.password.value,
            profile: {
                isOrganizer: $("[name='organizer']").is(":checked")
            }
        }, function(error) {
            if (error) {
                console.log(error.reason);
            }
            else {
                //Roles.addUsersToRoles(Meteor.userId(), event.target.role.value);
                Router.go('home');
            }
        });
    }
});