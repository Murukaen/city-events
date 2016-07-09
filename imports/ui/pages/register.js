import './register.html';

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        Accounts.createUser({
            'email': event.target.email.value,
            'password': event.target.password.value
        }, function(error) {
            if (error) {
                console.log(error.reason);
            }
            else {
                Router.go('home');
            }
        });
    }
});