import {DateUtils} from './date.js';

function assertFirstTimeOfDay(date, name){
    chai.assert.equal(date.getHours(), 0, `${name} must be on hour 0`);
    chai.assert.equal(date.getMinutes(), 0, `${name} must be on minute 0`);
    chai.assert.equal(date.getSeconds(), 0, `${name} must be on second 0`);
}

function assertLastTimeOfDay(date, name) {
    chai.assert.equal(date.getHours(), 23, `${name} must be on hour 23`);
    chai.assert.equal(date.getMinutes(), 59, `${name} must be on minute 59`);
    chai.assert.equal(date.getSeconds(), 59, `${name} must be on second 59`);
}

describe('DateUtils', function () {
  it('should addDays ', function () {
    chai.assert.equal(DateUtils.addDays(new Date(2010, 1, 1), 1).getTime(), new Date(2010, 1, 2).getTime(), 'must add one day in same month');
    chai.assert.equal(DateUtils.addDays(new Date(2010, 0, 31), 1).getTime(), new Date(2010, 1, 1).getTime(), 'must add one day towards next month');
    chai.assert.equal(DateUtils.addDays(new Date(2010, 11, 31), 1).getTime(), new Date(2011, 0, 1).getTime(), 'must add one day towards next year');
    chai.assert.equal(DateUtils.addDays(new Date(2010, 6, 15), 100).getTime(), new Date(2010, 9, 23).getTime(), 'must add the equivalent of more months in same year');
  });
  it('should getStartOfCurrentWeek', function () {
    let d = new Date();
    let ret = DateUtils.getStartOfCurrentWeek();
    chai.assert.equal(ret.getDay(), 1, 'result date must be on Monday');
    chai.assert.isAbove(d - ret, 0, 'result date must come before current date');
    chai.assert.isBelow(d - ret, 1000 * 3600 * 24 * 7, 'result date must not be more than 7 days apart from current date');
    assertFirstTimeOfDay(ret, 'result date');
  });
  it('should getStartAndEndOfCurrentMonth', function () {
    let {startDate: start, endDate: end} = DateUtils.getStartAndEndOfCurrentMonth();
    let d = new Date();
    chai.assert.equal(start.getMonth(), d.getMonth(), 'startDate must be on same month as current date');
    chai.assert.equal(start.getYear(), d.getYear(), 'startDate must be on same year as current date');
    chai.assert.equal(start.getDate(), 1, 'startDate must be on first day of month');
    assertFirstTimeOfDay(start, 'startDate');
    assertLastTimeOfDay(end, 'endDate');
    chai.assert.equal(end.getMonth(), d.getMonth(), 'endDate must be on same month as current date');
    chai.assert.equal(end.getYear(), d.getYear(), 'endDate must be on same year as current month');
    chai.assert.equal(new Date(end.getYear(), end.getMonth(), end.getDate() + 1).getMonth(), d.getMonth() + 1, 'endDate must be on last day of current month');
  });
  it('should getStartAndEndOfCurrentYear', function () {
    let {startDate: start, endDate: end} = DateUtils.getStartAndEndOfCurrentYear();
    let d = new Date();
    chai.assert.equal(start.getYear(), d.getYear(), 'startDate must be on same year as current date');
    chai.assert.equal(start.getMonth(), 0, 'startDate must be on first month of year');
    chai.assert.equal(start.getDate(), 1, 'startDate must be on first day of month');
    assertFirstTimeOfDay(start, 'startDate');
    chai.assert.equal(end.getYear(), d.getYear(), 'endDate must be on same year as current date');
    chai.assert.equal(end.getMonth(), 11, 'endDate must be on last month of year');
    chai.assert.equal(end.getDate(), 31, 'endDate must be on last day of month');
    assertLastTimeOfDay(end, 'endDate');
  });
});