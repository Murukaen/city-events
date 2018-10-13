import './profile.html'
import './profile.css'
import {PasswordScore} from '/imports/lib/password-score'

function initTabs() {
    $('.tab-content').css('display', 'none')
    $(`.tab-content[name=${$('button.active').attr('name')}]`).css('display', 'block')
}

Template.profile.onCreated(function () {
    this.strength = ReactiveVar(0)
})

Template.profile.onRendered(function () {
    initTabs()
    PasswordScore.addValidatorMethod("pwCheck")
    let self = this
    let passValidator = $('#change-pass').validate({
        rules: {
            new_password: {
                pwCheck: true
            }
        },
        submitHandler() {
            let oldPass = $('#old-pass').val()
            let newPass = $('#new-pass').val()
            Accounts.changePassword(oldPass, newPass, (err) => {
                if (err) {
                    if (err.reason == "Incorrect password") {
                        passValidator.showErrors({
                            old_password: err.reason    
                        });
                    } else {
                        console.log(err)
                    }
                } else {
                    $('#old-pass').val('')
                    $('#new-pass').val('')
                    self.strength.set(0)
                    sAlert.info("Password changed successfully")
                }
            })
        }
    })
    let usernameValidator = $('#change-username').validate({
        submitHandler() {
            Meteor.call('setUsername', $('#username').val(), (err) => {
                if (err) {
                    console.log(err)
                } else {
                    $('#username').val('')
                    sAlert.success("Username set")
                }
            })
        }
    })
    let locationValidator = $('#set-location').validate({
        submitHandler() {
            let country = $('#country').val()
            let city = $('#city').val()
            Meteor.call('updateProfile', {country, city}, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    $('#set-location')[0].reset()
                    sAlert.success("Location updated")
                }
            })
        }
    })
    Session.set('activeTabName', 'profile')
})

Template.profile.events({
    'click #fbLink': function() {
        Meteor.linkWithFacebook((err) => {
            if (err) {
                console.error(err)
            }
            else {
                sAlert.success("Facebook account linked")
                Meteor.call('updateProfile', {isLinkedWithFacebook: true})
            }
        });
    },
    'click #googleLink': function() {
        Meteor.linkWithGoogle((err) => {
            if (err) {
                console.error(err)
            }
            else {
                sAlert.success("Google account linked")
                Meteor.call('updateProfile', {isLinkedWithGoogle: true})
            }
        });
    },
    'click .tabs button': function(e,t) {
        $('.tab-content').css('display', 'none')
        $('.tabs button').removeClass('active')
        let name = $(e.target).attr('name')
        $(`.tab-content[name=${name}]`).css('display', 'block')
        $(`.tabs button[name=${name}]`).addClass('active')
    },
    'keyup input[name=new_password]': function(event, template) {
        template.strength.set(PasswordScore.getPasswordStrength($(event.target).val()))
    }
})

Template.profile.helpers({
    roundedPoints() {
        return Math.round(Template.instance().data.points)
    },
    strength() {
        return Template.instance().strength
    },
    showSocialLinkageInfo() {
        let data = Template.instance().data
        return !data.isVerified || !data.isLinkedWithFacebook || !data.isLinkedWithGoogle
    },
    usernamePlaceholder() {
        return Template.instance().data.username || "Username"
    },
    usernameHeading() {
        if (Template.instance().data.username) {
            return "Change username"
        }
        return "Set username"
    },
    countryPlaceholder() {
        return Template.instance().data.country || "Country"
    },
    cityPlaceholder() {
        return Template.instance().data.city || "City"
    }
})