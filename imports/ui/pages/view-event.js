import './view-event.html';
import './view-event.css';

Template.viewEvent.onCreated(function () {
    this.subscribe('events');
});
