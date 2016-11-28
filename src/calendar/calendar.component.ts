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

    @Input()
    items: Array<any>;
    itemsSize;

    @Input()
    getDateTime: Function;

    constructor() {
        console.debug("CalendarComponent::constructor()");
    }

    ngOnInit() {
        console.debug("CalendarComponent::ngOnInit()");
        this.itemsSize = this.items.length;
        this.buildCalendarArray(this.items);
    }

    buildCalendarArray(items: Array<any>) {

        console.debug("CalendarComponent::buildCalendarArray()");

        // First check array is not empty
        var arrayLength = this.items.length;
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
            }
            // Date.getDate returns day of month
            else if ((l_itemDate.getDate() > previousDate.getDate()) && (this.getFrenchDayOfWeek(l_itemDate) <= this.getFrenchDayOfWeek(previousDate) || (l_itemDate.getDate() - previousDate.getDate() >= 7))) {
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

        console.debug("CalendarComponent::buildCalendarArray(), calendarArray=" + JSON.stringify(this.calendarArray));
    }

    ngDoCheck() {
        //console.debug("CalendarComponent::ngDoCheck()");
        if (this.itemsSize !== this.items.length) {
            console.debug("CalendarComponent::ngDoCheck() detected change on items");
            this.itemsSize = this.items.length;
            this.buildCalendarArray(this.items);
        }
    }

    // returns day of week in France
    // Monday is 1, and so on. (Sunday is 7)
    getFrenchDayOfWeek(date: Date): number {
        // Date.getDay returns day of week, Sunday is 0, Monday is 1, and so on.
        var dayOfWeek: number = date.getDay();
        if (dayOfWeek === 0)
            return 7;
        return dayOfWeek;
    }

    calcFirstIndex(d: number, week: any[], item: any): number {
        //console.debug("CalendarComponent::calcFirstIndex(), item=" + JSON.stringify(item));
        if (d == 0)
            return 0;
        var l_date = this.getDateTime(week[d - 1][0]);
        return l_date.getDay();
    }

    calcLastIndex(d: number, week: any[], item: any) {
        //console.debug("CalendarComponent::calcLastIndex(), item=" + JSON.stringify(item));
        var l_date = this.getDateTime(item);
        return l_date.getDay() - 1;
    }

}