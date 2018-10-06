import './register.html'
import './register.css'
import './password-strength'
import {Profile} from '/imports/lib/profile'
import {PasswordScore} from '/imports/lib/password-score' 

Template.register.onCreated(function () {
    this.strength = ReactiveVar(0)
})

Template.register.onRendered(function() {
    PasswordScore.addValidatorMethod("pwCheck")
    let validator = $('.register').validate({
        rules: {
            password: {
                pwCheck: true
            }
        },
        submitHandler () {
            Accounts.createUser({
                email: $('.register #register-email').val(),
                password: $('.register #register-pass').val(),
                profile: {
                    points: 0
                }
            }, function(error) {
                if (error) {
                    if(error.reason == "Email already exists.") {
                        validator.showErrors({
                            email: "That email already belongs to a registered user."
                        })
                    }
                }
                else {
                    sAlert.success('Welcome')
                    if (!Profile.isDev()) {
                        Meteor.call( 'sendVerificationLink', ( error, response ) => {
                        if ( error ) {
                            console.log('Verification error', error.reason)
                        } else {
                            sAlert.info("Verification email sent")
                        }
                        })
                    }
                }
            })
        }
    })
})

Template.register.events({
    'submit form': function(event) {
        event.preventDefault()
    },
    'keyup input[name=password]': function(event, template) {
        template.strength.set(PasswordScore.getPasswordStrength($(event.target).val()))
    }
})

Template.register.helpers({
    strength () {
        return Template.instance().strength
    }
})
