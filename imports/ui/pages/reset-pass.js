import './reset-pass.html';

Template.resetPassword.onRendered(function () {
    let self = this;
    $('#resetPasswordForm').validate({
        rules: {
            'password': {
                required: true
            },
            'password-retype': {
                required: true,
                equalTo: "#pass"
            }
        },
        submitHandler() {
            console.log("Submit for token", self.data.token);
            Accounts.resetPassword(self.data.token, $('#pass').val(), function(err) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log("Password reset was successful");
                    Router.go('search');
                }
            });
        }
    });
});

Template.resetPassword.events({
    'submit form': function(event) {
        event.preventDefault();
    },
});