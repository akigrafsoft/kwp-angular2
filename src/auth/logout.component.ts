//
// Author: Kevin Moyse
//
import { Component, Input, EventEmitter, Output } from '@angular/core';
//import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth-logout',
    template: `<form name="logoutForm" class="form-inline enabled" accept-charset="UTF-8" (ngSubmit)="logout()" #logoutForm="ngForm">
<button id='logout-btn' type="submit" class="btn btn-success" [disabled]="!logoutForm.form.valid">{{LANG=='fr' ? 'Déconnexion' : 'Logout'}}</button></form>`
})
export class AuthLogoutComponent {
    title = 'Logout';

    @Input() LANG = 'en';
    @Output() onLogout = new EventEmitter<boolean>();

    error: any;

    constructor(
        //private router: Router,
        private authService: AuthService) {
    }

    logout() {
        //console.log("AuthLogoutComponent::logout()");
        this.authService.logout(this.authService.sessionId)
            .subscribe(
            data => {
                this.authService.successLogout();
                this.onLogout.emit(true);
                // DO THIS in onLogout implementation
                //this.router.navigate(['/']);
            },
            error => {
                this.authService.successLogout();
                this.error = error;
            });
    }

}

