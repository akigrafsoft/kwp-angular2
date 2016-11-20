//
// Author: Kevin Moyse
//
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth-login',
    templateUrl: 'app/kwp/auth/login.component.html'
})
export class AuthLoginComponent {

    title = 'Login';

    credentials = {};

    error: any;

    authenticatedUser: any;

    constructor(private router: Router, private auth: AuthService) {
        this.authenticatedUser = this.auth.authenticatedUser;
    }

    //    ngOnInit() {
    //        console.log("AuthLoginComponent::ngOnInit()");
    //    }

    private handleLoginResponse(response: any) {
        console.log("handleLoginResponse:" + JSON.stringify(response));

        window.localStorage
            .setItem(
            'sessionId',
            response.sessionId);

        this.auth.sessionId = response.sessionId;
        this.auth.authenticatedUser = response.user;
        this.auth.authenticatedRoles = response.userRoles;
        this.error = null;

        this.router.navigate(['/']);
    }
    private handleLoginErrorResponse(error: any) {
        //console.log("handleLoginErrorResponse:" + JSON.stringify(error));
        this.error = error.json();
        console.log("handleLoginErrorResponse:" + JSON.stringify(this.error));
    }
    login(credentials) {
        console.log("AuthLoginComponent::login(" + JSON.stringify(credentials) + ")");
        this.auth.login(credentials)
            .then(response => this.handleLoginResponse(response))
            .catch(error => this.handleLoginErrorResponse(error));
    }

}