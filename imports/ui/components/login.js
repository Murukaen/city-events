import './login.html';
import './login.css';

function welcomeAlert(email) {
    sAlert.success(`Welcome ${email}`)
}

function setSessionCountryCity() {
    let country = Meteor.user().profile.country
    let city = Meteor.user().profile.city
    country && Meteor.call('getCountries', (err, resp) => {
        if (err) {
            console.log(err)
        } else {
            if(resp.indexOf(country) >= 0) {
                Session.set("country", country)
                city && Meteor.call('getCities', country, (err, resp) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if(resp.indexOf(city) >= 0) {
                            Session.set("city", city)
                        }
                    }
                })
            }    
        }
    })   
}

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
    }
});

Template.login.onRendered(function () {
    var validator = $('.login').validate({
        submitHandler (event) {
            let email = $(".login #login-email").val()
            let pass  = $(".login #login-pass").val()
            Meteor.loginWithPassword(email, pass, function(error) {
                if (error) {
                    if(error.reason == "User not found") {
                        validator.showErrors({
                            email: error.reason    
                        });
                    }
                    if(error.reason == "Incorrect password"){
                        validator.showErrors({
                            password: error.reason    
                        });
                    }
                } else {
                    setSessionCountryCity()
                    welcomeAlert(email)
                }
            });
        }
    });
});

Template.login.events({
    'click .forgot-pass': function(event) {
        $(event.target).closest(".dropdown-menu").prev().dropdown("toggle");
        Router.go('forgot-pass');
    },
    'click #fb-login': function() {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                if (err.reason == 'Must link account first') {
                    sAlert.warning("Facebook account is not linked")
                }
                else {
                    console.error("Facebook login failed with:", err)
                }
            } else {
                setSessionCountryCity()
                welcomeAlert(Meteor.user().emails[0].address)
            }
        });
    },
    'click #google-login': function() {
        Meteor.loginWithGoogle({}, function(err){
            if (err) {
                if (err.reason == 'Must link account first') {
                    sAlert.warning("Google account is not linked")
                }
                else {
                    console.error("Google login failed with:", err)
                }
            } else {
                setSessionCountryCity()
                welcomeAlert(Meteor.user().emails[0].address)
            }
        });
    }
});