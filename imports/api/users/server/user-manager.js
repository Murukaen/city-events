export const UserManager = {
    SCORE_INCREMENT: 2,
    increaseScore() {
        if (Meteor.userId()) {
            Meteor.users.update({_id: Meteor.userId()}, 
                {$inc: {"profile.points": UserManager.SCORE_INCREMENT}});
        }
    }
}