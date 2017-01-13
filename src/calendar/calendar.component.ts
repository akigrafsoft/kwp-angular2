//
// Author: Kevin Moyse
//
import { Component, OnInit, Input, DoCheck } from '@angular/core';

@Component({
    selector: 'kwp-calendar',
    //    templateUrl: 'app/kwp/calendar/calendar.component.html',
    template: '<ng-content></ng-content>'
})
export class CalendarComponent implements OnInit, DoCheck {

    daysOfAWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    calendarArray = new Array();
    calendarMonthIndex = 0;

    @Input() items: Array<any>;
    @Input() getDateTime: Function;

    @Input() showDate: Date = null;

    // used to detect changes
    //private itemsSize: number;

    constructor() {
        //console.debug("CalendarComponent::constructor()");
    }

    ngOnInit() {
        //console.debug("CalendarComponent::ngOnInit()");
        // store itemsSize at init allows to detect changes
        //this.itemsSize = this.items.length;
        this.buildCalendarArray();
    }

    public refresh(items: Array<any>) {
        this.items = items;
        this.buildCalendarArray();
    }

    private buildCalendarArray() {

        // console.debug("CalendarComponent::buildCalendarArray()");

        // First check array emptyness
        var arrayLength: number = this.items !== null ? this.items.length : 0;
        if (arrayLength === 0) {
            this.calendarArray = new Array();
            this.calendarMonthIndex = 0;
            return;
        }

        var _self = this;
        // sort by date
        this.items.sort(function(a, b) {
            //return Date.parse(a.dateTime) - Date.parse(b.dateTime);
            return _self.getDateTime(a) - _self.getDateTime(b);
        });
        // console.debug("ActivityComponent::handleActivity(), sort done");

        // init with first slot date
        var previousDate: Date = this.getDateTime(this.items[0]);

        var calendarArray = new Array();
        var currentMonth = new Array();
        var currentWeek = new Array();
        var currentDay = new Array();

        //console.debug("CalendarComponent::buildCalendarArray(), arrayLength=" + arrayLength);
        for (var i = 0; i < arrayLength; i++) {

            var l_item = this.items[i];

            //var l_itemDate: Date = new Date(Date.parse(this.getDateTime(l_item)));
            var l_itemDate: Date = this.getDateTime(l_item);
            //console.debug("CalendarComponent::buildCalendarArray(), loop i=" + i + ", l_item=" + JSON.stringify(l_item) + ", dayOfMonth=" + l_itemDate.getDate() + ", dayOfWeek=" + l_itemDate.getDay());

            if (l_itemDate.getMonth() != previousDate.getMonth()) {
                // new month
                //if (currentDay.length != 0) {
                currentWeek.push(currentDay);
                currentDay = new Array();
                currentMonth.push(currentWeek);
                currentWeek = new Array();
                calendarArray.push(currentMonth);
                currentMonth = new Array();
                //console.debug("CalendarComponent::buildCalendarArray(), changeMonth at i=" + i);
                if (this.showDate != null) {
                    var firstDayOfMonth: Date = new Date(l_itemDate.getFullYear(), l_itemDate.getMonth(), 1);
                    //console.debug("CalendarComponent::buildCalendarArray(), showDate=" + this.showDate + ", firstDayOfMonth=" + firstDayOfMonth);
                    if (this.showDate >= firstDayOfMonth) {
                        //console.debug("CalendarComponent::buildCalendarArray(), showDate=" + this.showDate + " >= firstDayOfMonth=" + firstDayOfMonth);
                        this.calendarMonthIndex = calendarArray.length;
                    }
                }
            }
            // Date.getDate returns day of month
            else if ((l_itemDate.getDate() > previousDate.getDate()) && (this.toFrenchDayOfWeek(l_itemDate.getDay()) <= this.toFrenchDayOfWeek(previousDate.getDay()) || (l_itemDate.getDate() - previousDate.getDate() >= 7))) {
                // new week
                currentWeek.push(currentDay);
                currentDay = new Array();
                currentMonth.push(currentWeek);
                currentWeek = new Array();
                //console.debug("CalendarComponent::buildCalendarArray(), changeWeek at i=" + i);
            }
            else if (l_itemDate.getDate() > previousDate.getDate()) {
                // new Day
                currentWeek.push(currentDay);
                currentDay = new Array();
                //console.debug("CalendarComponent::buildCalendarArray(), changeDay at i=" + i);
            }

            currentDay.push(l_item);
            previousDate = l_itemDate;
        }

        currentWeek.push(currentDay);
        currentMonth.push(currentWeek);
        calendarArray.push(currentMonth);

        this.calendarArray = calendarArray;

        //console.debug("CalendarComponent::buildCalendarArray(), calendarArray=" + JSON.stringify(this.calendarArray));
    }

    ngDoCheck() {
        //console.debug("CalendarComponent::ngDoCheck()");
        //if (this.itemsSize !== this.items.length) {
        //console.debug("CalendarComponent::ngDoCheck() detected change on items");
        //    this.itemsSize = this.items.length;
        //    this.buildCalendarArray(this.items);
        //}
    }

    //
    //Date.getDay returns day of week, Sunday is 0, Monday is 1, and so on.
    //toFrenchDayOfWeek return Monday 0, ... Sunday 6
    toFrenchDayOfWeek(dayOfWeek: number): number {
        return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    }

    calcOffset(index: number, week: any[]): number {
        var dayOfWeek = this.getDateTime(week[index][0]).getDay();
        if (index == 0) {
            // Date.getDay returns day of week, Sunday is 0, Monday is 1, and so on.
            return this.toFrenchDayOfWeek(dayOfWeek);
        }
        var prevDayOfWeek = this.getDateTime(week[index - 1][0]).getDay();
        return this.toFrenchDayOfWeek(dayOfWeek) - this.toFrenchDayOfWeek(prevDayOfWeek) - 1;
    }

}