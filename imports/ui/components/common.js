import './common.html';

Template.registerHelper('formatDate', (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm");
});