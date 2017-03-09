import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleplaceDirective } from './googleplace.directive';
import { MapComponent } from './map.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [GoogleplaceDirective, MapComponent],
    exports: [GoogleplaceDirective, MapComponent]
})
export class MapsModule { }