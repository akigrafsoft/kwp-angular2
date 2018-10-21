import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AuthLoginComponent} from './login.component';
import {AuthLogoutComponent} from './logout.component';

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [AuthLoginComponent, AuthLogoutComponent],
  exports: [AuthLoginComponent, AuthLogoutComponent]
  // exports: [Role],
  // Do not specify app-wide singleton providers in a shared module.
  // A lazy-loaded module that imports that shared module makes its own copy of the service.
  // providers: [AuthService, SessionsService, SessionObjectsService
  // ]
})
export class AuthModule {

}
