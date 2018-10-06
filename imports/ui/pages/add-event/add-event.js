import './add-event.html';
import '../add-edit-event/add-edit-event';

Template.addEvent.onRendered(function () {
    Session.set('activeTabName', 'add-event')
})