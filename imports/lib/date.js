export const DateUtils = {
    'addDays': function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    'getStartOfCurrentWeek': function () {
        let date = new Date();
        let day = date.getDay() || 7;
        if( day !== 1 ) 
            date.setHours(-24 * (day - 1)); 
        return date;
    },
    'getStartAndEndOfCurrentMonth': function () {
        let date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return {startDate: startDate, endDate: endDate};
    }
}
