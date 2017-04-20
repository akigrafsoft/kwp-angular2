import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagedListModule } from '../pagedlist/pagedlist.module';

import { ActivationComponent } from './activation.component';

import { RegistrationComponent } from './registration.component';

import { UserFormComponent } from './user-form.component';
import { UsersComponent } from './users.component';
import { ChangePasswordFormComponent } from './change-password-form.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, PagedListModule
    ],
    declarations: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersComponent, ChangePasswordFormComponent],
    exports: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersComponent, ChangePasswordFormComponent]
    //Do not specify app-wide singleton providers in a shared module. A lazy-loaded module that imports that shared module makes its own copy of the service.
    //providers: [ActivationService, UserService]
})
export class UsersModule { }