export const DateUtils = {
    addDays (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    getStartOfCurrentWeek () {
        let date = new Date();
        let day = date.getDay() || 7;
        if( day !== 1 ) 
            date.setHours(-24 * (day - 1)); 
        date.setHours(0, 0, 0);
        return date;
    },
    getStartAndEndOfCurrentMonth () {
        let date = new Date();
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        startDate.setHours(0,0,0);
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23,59,59);
        return {startDate, endDate};
    },
    getStartAndEndOfCurrentYear () {
        let date = new Date();
        let startDate = new Date(date.getFullYear(), 0, 1);
        startDate.setHours(0,0,0);
        let endDate = new Date(date.getFullYear() + 1, 0, 0);
        endDate.setHours(23,59,59);
        return {startDate, endDate};
    }
}
