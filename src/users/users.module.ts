import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//import { PagedListDirective } from 'kwp-angular2/pagedlist';
import { PagedListModule } from '../pagedlist/pagedlist.module';
//import { PagedListDirective } from '../pagedlist/pagedlist.directive';

import { ActivationComponent } from './activation.component';
//import { ActivationService } from './activation.service';

import { RegistrationComponent } from './registration.component';

import { UserFormComponent } from './user-form.component';
//import { UserService } from './user.service';
import { UsersComponent } from './users.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, PagedListModule
    ],
    declarations: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersComponent],
    exports: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersComponent]
    //Do not specify app-wide singleton providers in a shared module. A lazy-loaded module that imports that shared module makes its own copy of the service.
    //providers: [ActivationService, UserService]
})
export class UsersModule { }