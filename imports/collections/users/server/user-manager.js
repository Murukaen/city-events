var SCORE_FORMULA_ALPHA = 2;
var SCORE_FORMULA_BETA = 3;

function updateScore(userId, value) {
    if (userId) {
        Meteor.users.update({_id: userId}, {$inc: {"profile.points": value}});
    }
}

function computeScoreValue(diff) {
    console.log("diff:", diff);
    return SCORE_FORMULA_ALPHA * Math.E ** (Math.cbrt(diff) / SCORE_FORMULA_BETA);
}

function getUserScore(user) {
    return user.profile.points;
}

function getScoreDiff(userId, evalUserId) {
    let user = Meteor.users.findOne(userId);
    let evalUser = Meteor.users.findOne(evalUserId);
    return getUserScore(evalUser) - getUserScore(user);
}

export const UserManager = {
    increaseScore(userId = Meteor.userId(), evalUserId = null) {
        if (evalUserId == null) {
            evalUserId = userId;
        }
        let value = computeScoreValue(getScoreDiff(userId, evalUserId));
        updateScore(userId, value);
    },
    decreaseScore(userId, evalUserId) {
        let value = -computeScoreValue(getScoreDiff(userId, evalUserId));
        updateScore(userId, value);
    }
}