Meteor.users.after.insert(function (userId, doc) {
    if (doc.profile.isOrganizer) {
        Roles.addUsersToRoles(doc._id, 'organizer');
    } 
    else {
        Roles.addUsersToRoles(doc._id, 'normal');
    }
});