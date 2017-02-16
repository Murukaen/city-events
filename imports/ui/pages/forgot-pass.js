import './forgot-pass.html';

var trimInput = function(val) {
    return val.replace(/\s*/g, "");
}

var isNotEmpty = function(val) {
    return val != null && val != "";
}

Template.forgotPassword.onRendered(function () {
    $('#forgotPasswordForm').validate({
        submitHandler() {
            var email = trimInput($('#forgotPasswordForm #forgotPasswordEmail').val().toLowerCase());
            Accounts.forgotPassword({email: email}, function(err) {
                if (err) {
                  if (err.message === 'User not found [403]') {
                    console.log('This email does not exist.');
                  } else {
                    console.log('We are sorry but something went wrong.');
                  }
                } else {
                  console.log('Email Sent. Check your mailbox.');
                }
            });
        }
    });
});

Template.forgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();
  },
});