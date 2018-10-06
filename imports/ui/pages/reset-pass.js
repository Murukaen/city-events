import './reset-pass.html'
import './reset-pass.css'
import {PasswordScore} from '/imports/lib/password-score'

Template.resetPassword.onCreated(function () {
    this.strength = ReactiveVar(0)
})

Template.resetPassword.onRendered(function () {
    let self = this
    PasswordScore.addValidatorMethod("pwCheck")
    $('#resetPasswordForm').validate({
        rules: {
            'password': {
                required: true,
                pwCheck: true
            },
            'password-retype': {
                required: true,
                equalTo: "#pass"
            }
        },
        submitHandler() {
            Accounts.resetPassword(self.data.token, $('#pass').val(), function(err) {
                if (err) {
                    console.log(err.message)
                }
                else {
                    Session.set('passwordReset', true)
                    Router.go('pickCountry')
                }
            })
        }
    })
})

Template.resetPassword.events({
    'submit form': function(event) {
        event.preventDefault()
    },
    'keyup input[name=password]': function(event, template) {
        template.strength.set(PasswordScore.getPasswordStrength($(event.target).val()))
    }
});

Template.resetPassword.helpers({
    strength () {
        return Template.instance().strength
    }
})