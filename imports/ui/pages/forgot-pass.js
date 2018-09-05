import './forgot-pass.html'

var trimInput = function(val) {
    return val.replace(/\s*/g, "")
}

var isNotEmpty = function(val) {
    return val != null && val != ""
}

Template.forgotPassword.onCreated(() => {
    let template = Template.instance()
    template.errors = new ReactiveDict()
    template.mailSent = new ReactiveVar(false)
})

Template.forgotPassword.onRendered(function () {
    let template = Template.instance()
    $('#forgotPasswordForm').validate({
        submitHandler() {
            var email = trimInput($('#forgotPasswordForm #forgotPasswordEmail').val().toLowerCase())
            Accounts.forgotPassword({email}, (err) => {
                let errors = {}
                if (err) {
                  if (err.message === 'User not found [403]') {
                    errors['email'] = 'This email does not exist.'
                  } else {
                    console.log('We are sorry but something went wrong.', err)
                  }
                } else {
                  console.log('Email Sent. Check your mailbox.')
                  template.mailSent.set(true)
                }
                template.errors.set(errors)
            })
        }
    })
})

Template.forgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault()
  },
  'keyup input[name="email"]': function(e,t) {
    t.errors.clear()
  } 
})

Template.forgotPassword.helpers({
    error(name) {
        return Template.instance().errors.get(name)
    },
    mailSent() {
        return Template.instance().mailSent.get()
    }
})