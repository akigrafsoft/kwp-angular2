import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NumberFixedLenPipe} from './number-fixed-len.pipe';
import {NumberLongPipe} from './number-long.pipe';
import {ObjectIdPipe} from './object-id.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NumberFixedLenPipe, NumberLongPipe, ObjectIdPipe],
  exports: [NumberFixedLenPipe, NumberLongPipe, ObjectIdPipe]
})
export class PipesModule {}
