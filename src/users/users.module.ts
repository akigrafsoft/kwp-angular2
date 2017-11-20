import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagedListModule } from '../pagedlist/pagedlist.module';
import { PipesModule } from '../pipes/pipes.module';

import { ActivationComponent } from './activation.component';

import { RegistrationComponent } from './registration.component';

import { UserFormComponent } from './user-form.component';
import { UsersListComponent } from './users-list.component';
import { ChangePasswordFormComponent } from './change-password-form.component';

@NgModule({
    imports: [
        CommonModule, FormsModule, PagedListModule, PipesModule
    ],
    declarations: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersListComponent, ChangePasswordFormComponent],
    exports: [ActivationComponent, RegistrationComponent, UserFormComponent, UsersListComponent, ChangePasswordFormComponent]
    //Do not specify app-wide singleton providers in a shared module. A lazy-loaded module that imports that shared module makes its own copy of the service.
    //providers: [ActivationService, UserService]
})
export class UsersModule { }