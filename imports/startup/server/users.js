Meteor.startup(() => {
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset-pass/' + token);
    };
    Accounts.urls.verifyEmail = function(token) {
        return Meteor.absoluteUrl('verify-email/' + token);
    };
});

Accounts.validateNewUser((user) => {
    if(user.hasOwnProperty('emails'))
        return true;
    throw new Meteor.Error(403, "Must link account first");
});

// Accounts.emailTemplates.resetPassword.text = function(user, url) {
//     var token = url.substring(url.lastIndexOf('/') + 1, url.length);
//     var newUrl = Meteor.absoluteUrl('reset-password/' + token);
//     var str = 'Hello, \n';
//         str+= 'Click on the following link to reset your password \n';
//         str+= newUrl;
//     return str;
//   };