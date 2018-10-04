import './profile.html'
import './profile.css'

Template.profile.onRendered(function () {
    $('.tab-content').css('display', 'none')
    $(`.tab-content[name=${$('button.active').attr('name')}]`).css('display', 'block')
    let validator = $('#change-pass').validate({
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
                console.error(err);
            }
            else {
                Meteor.call('updateProfile', {key: 'isLinkedWithFacebook', value: true});
            }
        });
    },
    'click .tabs button': function(e,t) {
        $('.tab-content').css('display', 'none')
        $('.tabs button').removeClass('active')
        let name = $(e.target).attr('name')
        $(`.tab-content[name=${name}]`).css('display', 'block')
        $(`.tabs button[name=${name}]`).addClass('active')
    }
})

Template.profile.helpers({
    roundedPoints() {
        return Math.round(Template.instance().data.points);
    }
});