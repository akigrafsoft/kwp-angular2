import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarDirective } from './calendar.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CalendarDirective],
    exports: [CalendarDirective]
})
export class CalendarModule { }
