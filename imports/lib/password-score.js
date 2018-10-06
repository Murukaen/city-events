const zxcvbn = require('zxcvbn')

export const PasswordScore = {
    threshold: 3,
    getPasswordStrength(value) {
        return zxcvbn(value).score
    },
    addValidatorMethod(name, msg = "Password is too weak") {
        $.validator.addMethod(name, function(value, element) {
            return PasswordScore.getPasswordStrength(value) >= PasswordScore.threshold
        }, msg)
    }
}
