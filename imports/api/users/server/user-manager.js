export const UserManager = {
    SCORE_INCREMENT: 2,
    increaseScore(userId = Meteor.userId()) {
        if (userId) {
            Meteor.users.update({_id: userId}, 
                {$inc: {"profile.points": UserManager.SCORE_INCREMENT}});
        }
    }
}