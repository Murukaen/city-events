export const Location = {
    updateCountryCitySession() {
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
}