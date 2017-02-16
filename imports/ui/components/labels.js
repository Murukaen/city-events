import './labels.html';
import './labels.css';

Labels = function(labels) {
    this.reactive = new ReactiveVar(labels ? labels : []);
    this.getLabels = function() {
        return this.reactive.get();
    }
    this.addLabel = function(label) {
        this.reactive.set(this.getLabels().concat(label));
    }
    this.addSingleLabel = function(label) {
        this.reactive.set([label]);
    }
    this.removeLabel = function(label) {
        let labelNames = this.getLabels();
        labelNames.splice(labelNames.indexOf(label), 1);
        this.reactive.set(labelNames);
    }
}

Template.labelsT.events({
    'click .remove': function(event, template) {
        template.data.removeLabel($(event.target).closest('li').find('span').text().trim());
    }
});

Template.labelsT.helpers({
    labels () {
        return Template.instance().data.getLabels();
    }
})