//
// Author: Kevin Moyse
//
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth-logout',
    template: `<form name="logoutForm" class="form-inline enabled" accept-charset="UTF-8" (ngSubmit)="logout()" #logoutForm="ngForm">
<button type="submit" class="btn btn-success" [disabled]="!logoutForm.form.valid">{{LANG=='fr' ? 'Déconnexion' : 'Logout'}}</button></form>`
})
export class AuthLogoutComponent {
    title = 'Logout';

    @Input() LANG = 'en';

    error: any;

    constructor(private router: Router, private auth: AuthService) {
    }

    logout() {
        console.log("AuthLogoutComponent::logout()");
        this.auth.logout(this.auth.sessionId)
            .subscribe(
            data => this.handleLogoutResponse(data),
            error => this.error = error);
        //            .then(response => this.handleLogoutResponse(response))
        //            .catch(error => this.handleLogoutErrorResponse(error));
    }
    private handleLogoutResponse(data: any) {
        console.log("handleLogoutResponse:" + JSON.stringify(data));
        this.doLogout();
    }
    private handleLogoutErrorResponse(error: any) {
        this.error = error.json();
        console.log("handleLogoutErrorResponse:" + JSON.stringify(this.error));
        this.doLogout();
    }

    private doLogout() {
        this.auth.successLogout();
        this.router.navigate(['/']);
    }

}

