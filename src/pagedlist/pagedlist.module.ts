import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagedListDirective } from './pagedlist.directive';
//import { PagedListService } from './pagedlist.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [PagedListDirective],
    exports: [PagedListDirective],
    //Do not specify app-wide singleton providers in a shared module. A lazy-loaded module that imports that shared module makes its own copy of the service.
    //providers: [PagedListService]
})
export class PagedListModule { }

//export class PagedListDirective {};