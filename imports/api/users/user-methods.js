Meteor.methods({
    sendVerificationLink() {
        if (Meteor.isServer) {
            let userId = Meteor.userId();
            if ( userId ) {
              return Accounts.sendVerificationEmail( userId );
            }
        }
    }
});