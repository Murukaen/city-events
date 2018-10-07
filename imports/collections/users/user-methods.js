Meteor.methods({
    sendVerificationLink() {
        if (Meteor.isServer) {
            let userId = Meteor.userId();
            if ( userId ) {
              return Accounts.sendVerificationEmail( userId );
            }
        }
    },
    updateProfile({key, value}) {
        if (Meteor.userId()) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {["profile." + key]: value}});
        }
    }
});