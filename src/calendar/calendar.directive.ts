//
// Author: Kevin Moyse
//
import {Directive, OnInit, Input} from '@angular/core';

@Directive({
  selector: '[kwp-calendar]',
  //    templateUrl: 'app/kwp/calendar/calendar.component.html',
  //    template: '<ng-content></ng-content>',
  exportAs: 'kwpCalendar'
})
export class CalendarDirective implements OnInit {
  //    , DoCheck

  daysOfAWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  calendarArray = new Array();
  calendarMonthIndex = 0;

  @Input('kwp-calendar') items: Array<any>;

  @Input('getDateTime') getDateTime: Function;

  @Input('showDate') showDate: Date = null;

  constructor() {
    // console.debug("Calendar::constructor()");
  }

  ngOnInit() {
    // console.debug("Calendar::ngOnInit()");
    // store itemsSize at init allows to detect changes
    // this.itemsSize = this.items.length;
    this.buildCalendarArray();
  }

  public refresh(items: Array<any>) {
    this.items = items;
    this.buildCalendarArray();
  }

  private buildCalendarArray() {

    // console.debug("Calendar::buildCalendarArray()");

    // First check array emptyness
    const arrayLength: number = this.items !== null ? this.items.length : 0;
    if (arrayLength === 0) {
      this.calendarArray = new Array();
      this.calendarMonthIndex = 0;
      return;
    }

    const _self = this;
    // sort by date
    this.items.sort(function(a, b) {
      // return Date.parse(a.dateTime) - Date.parse(b.dateTime);
      return _self.getDateTime(a) - _self.getDateTime(b);
    });
    // console.debug("Activity::handleActivity(), sort done");

    // init with first slot date
    let previousDate: Date = this.getDateTime(this.items[0]);

    let calendarArray = new Array();
    let currentMonth = new Array();
    let currentWeek = new Array();
    let currentDay = new Array();

    // console.debug("Calendar::buildCalendarArray(), arrayLength=" + arrayLength);
    for (let i = 0; i < arrayLength; i++) {

      const l_item = this.items[i];
      const l_itemDate: Date = this.getDateTime(l_item);

      if (l_itemDate.getMonth() !== previousDate.getMonth()) {
        // new month
        currentWeek.push(currentDay);
        currentDay = new Array();
        currentMonth.push(currentWeek);
        currentWeek = new Array();
        calendarArray.push(currentMonth);
        currentMonth = new Array();
        if (this.showDate != null) {
          const firstDayOfMonth: Date = new Date(l_itemDate.getFullYear(), l_itemDate.getMonth(), 1);
          // console.debug("Calendar::buildCalendarArray(), showDate=" + this.showDate + ", firstDayOfMonth=" + firstDayOfMonth);
          if (this.showDate >= firstDayOfMonth) {
            // console.debug("Calendar::buildCalendarArray(), showDate=" + this.showDate + " >= firstDayOfMonth=" + firstDayOfMonth);
            this.calendarMonthIndex = calendarArray.length;
          }
        }
      } else if ((l_itemDate.getDate() > previousDate.getDate())
        && (this.toFrenchDayOfWeek(l_itemDate.getDay()) <= this.toFrenchDayOfWeek(previousDate.getDay())
          || (l_itemDate.getDate() - previousDate.getDate() >= 7))) {
        // Date.getDate returns day of month
        // new week
        currentWeek.push(currentDay);
        currentDay = new Array();
        currentMonth.push(currentWeek);
        currentWeek = new Array();
        // console.debug("Calendar::buildCalendarArray(), changeWeek at i=" + i);
      } else if (l_itemDate.getDate() > previousDate.getDate()) {
        // new Day
        currentWeek.push(currentDay);
        currentDay = new Array();
        // console.debug("Calendar::buildCalendarArray(), changeDay at i=" + i);
      }

      currentDay.push(l_item);
      previousDate = l_itemDate;
    }

    currentWeek.push(currentDay);
    currentMonth.push(currentWeek);
    calendarArray.push(currentMonth);

    this.calendarArray = calendarArray;

    // console.debug("Calendar::buildCalendarArray(), calendarArray=" + JSON.stringify(this.calendarArray));
  }


  //
  // Date.getDay returns day of week, Sunday is 0, Monday is 1, and so on.
  // toFrenchDayOfWeek return Monday 0, ... Sunday 6
  toFrenchDayOfWeek(dayOfWeek: number): number {
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  calcOffset(index: number, week: any[]): number {
    const dayOfWeek = this.getDateTime(week[index][0]).getDay();
    if (index === 0) {
      // Date.getDay returns day of week, Sunday is 0, Monday is 1, and so on.
      return this.toFrenchDayOfWeek(dayOfWeek);
    }
    const prevDayOfWeek = this.getDateTime(week[index - 1][0]).getDay();
    return this.toFrenchDayOfWeek(dayOfWeek) - this.toFrenchDayOfWeek(prevDayOfWeek) - 1;
  }

  public prevPage() {
    // console.debug("PagedList::prevPage:" + (this.currentPage - 1));
    if (this.calendarMonthIndex > 0) {
      this.calendarMonthIndex = this.calendarMonthIndex - 1;
    }
  };
  public nextPage() {
    // console.debug("PagedList::nextPage:" + (this.currentPage + 1));
    if (this.calendarMonthIndex < this.calendarArray.length - 1) {
      this.calendarMonthIndex = this.calendarMonthIndex + 1;
    }
  };

}
