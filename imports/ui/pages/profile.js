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
    let validator = $('#change-pass').validate({
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
                        validator.showErrors({
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
})

Template.profile.events({
    'click #fbLink': function() {
        Meteor.linkWithFacebook((err) => {
            if (err) {
                console.error(err)
            }
            else {
                Meteor.call('updateProfile', {key: 'isLinkedWithFacebook', value: true})
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
    }
})