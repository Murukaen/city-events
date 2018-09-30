import './labels.html';
import './labels.css';

Template.labelsT.events({
    'click .remove': function(event, template) {
        let labels = template.data.get()
        labels.splice(labels.indexOf($(event.target).closest('li').find('span').text().trim()), 1)
        template.data.set(labels)
    }
});

Template.labelsT.helpers({
    labels () {
        return Template.instance().data.get();
    }
})