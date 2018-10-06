import './forgot-pass.html'
import './forgot-pass.css'

var trimInput = function(val) {
    return val.replace(/\s*/g, "")
}

var isNotEmpty = function(val) {
    return val != null && val != ""
}

Template.forgotPassword.onCreated(() => {
    let template = Template.instance()
    template.errors = new ReactiveDict({})
    template.mailSent = new ReactiveVar(false)
    template.submitted = new ReactiveVar(false)
    template.email = ''
})

Template.forgotPassword.onRendered(function () {
    let template = Template.instance()
    $('#forgot-password-form').validate({
        submitHandler() {
            template.submitted.set(true)
            let email = trimInput($('#forgotPasswordEmail').val().toLowerCase())
            Accounts.forgotPassword({email}, (err) => {
                let errors = {}
                if (err) {
                  if (err.message === 'User not found [403]') {
                    errors['email'] = 'This email does not exist.'
                  } else if (err.error === 'too-many-requests') {
                    sAlert.error("Too many request. Please wait 4 seconds before trying again.", {
                        timeout: 3500
                    })
                  } else {
                    console.log('We are sorry but something went wrong.', err)
                  }
                  template.submitted.set(false)
                } else {
                  $('#forgot-password-form').hide()
                  template.email = email
                  template.mailSent.set(true)
                }
                template.errors.set(errors)
            })
        }
    })
})

Template.forgotPassword.events({
  'submit #forgot-password-form': function(e, t) {
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
    },
    submitted() {
        return Template.instance().submitted.get()
    },
    showLoading() {
        return Template.instance().submitted.get() && !Template.instance().mailSent.get()
            && Object.keys(Template.instance().errors.all()).length == 0
    },
    email() {
        return Template.instance().email
    }
})