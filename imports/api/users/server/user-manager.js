export const UserManager = {
    SCORE_INCREMENT: 2,
    updateScore(userId, value) {
        if (userId) {
            Meteor.users.update({_id: userId}, {$inc: {"profile.points": value}});
        }
    },
    increaseScore(userId = Meteor.userId()) {
        UserManager.updateScore(userId, UserManager.SCORE_INCREMENT);
    },
    decreaseScore(userId) {
        UserManager.updateScore(userId, -UserManager.SCORE_INCREMENT);
    }
}