Meteor.methods({
    sendVerificationLink() {
        if (Meteor.isServer) {
            let userId = Meteor.userId();
            if ( userId ) {
              return Accounts.sendVerificationEmail( userId )
            }
        }
    },
    updateProfile(props) {
        if (Meteor.userId()) {
            for(var key in props) {
                Meteor.users.update({_id: Meteor.userId()}, {$set: {["profile." + key]: props[key]}})
            }
        }
    },
    setUsername(username) {
        if (!this.isSimulation) {
            return Accounts.setUsername(Meteor.userId(), username)
        }
    }
})