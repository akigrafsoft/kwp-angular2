//
// Author: Kevin Moyse
//
import { Component, Input, EventEmitter, Output } from '@angular/core';
//import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Error } from '../services/error';

@Component({
    selector: 'auth-logout',
    template: `<form name="logoutForm" class="form-inline enabled" accept-charset="UTF-8" (ngSubmit)="logout()" #logoutForm="ngForm">
<button id='logout-btn' type="submit" class="btn btn-success" [disabled]="!logoutForm.form.valid"><span class="glyphicon glyphicon-off" aria-hidden="true"></span>&nbsp;{{LANG=='fr' ? 'Déconnexion' : 'Logout'}}</button></form>`
})
export class AuthLogoutComponent {

    @Input() LANG = 'en';
    @Output() onLogout = new EventEmitter<boolean>();

    private error: Error = null;

    constructor(
        private authService: AuthService) {
    }

    logout() {
        //console.log("AuthLogout::logout()");
        this.authService.logout(this.authService.sessionId)
            .subscribe(
            data => {
                this.authService.successLogout();
                this.onLogout.emit(true);
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                    //                    setTimeout(() => {
                    //                        this.error = null;
                    //                    }, 3000);
                }
                else {
                    console.error("AuthLogout::logout|" + error);
                    this.error = Error.build(-1, error);
                }
                // whatever the result, consider logout
                this.authService.successLogout();
                this.onLogout.emit(true);
            });
    }

}

