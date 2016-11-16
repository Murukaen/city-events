import './common.html';

Template.registerHelper('formatDate', (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm");
});


Template.needEmailVerification.onCreated(function () {
    this.validationSent = new ReactiveVar(false);
    this.validationSentSuccessfulyl = new ReactiveVar(true);    
});


Template.needEmailVerification.events({
    'click .resend-verification-email': function(event, template) {
        console.log('Click');
        Meteor.call('sendVerificationLink', (err, response) => {
            template.validationSent.set(true);
            if (err) {
                template.validationSentSuccessfulyl.set(false);
            }
        });
    }
});

Template.needEmailVerification.helpers({
    'validationSent': function() {
        return Template.instance().validationSent.get();
    },
    'validationSentSuccessfulyl': function() {
        return Template.instance().validationSentSuccessfulyl.get();
    }
})