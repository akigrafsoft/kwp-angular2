import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberFixedLenPipe } from './number-fixed-len.pipe';
import { NumberLongPipe } from './number-long.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NumberFixedLenPipe, NumberLongPipe],
    exports: [NumberFixedLenPipe, NumberLongPipe]
})
export class PipesModule { }