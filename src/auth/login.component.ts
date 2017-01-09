//
// Author: Kevin Moyse
//
import { Component, Input, EventEmitter, Output } from '@angular/core';
//import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Error } from '../services/error';

@Component({
    selector: 'auth-login',
    //    templateUrl: 'app/kwp/auth/login.component.html'
    template: `
<div><form name="loginForm" class="form-inline enabled" accept-charset="UTF-8" (ngSubmit)="login(credentials)" #loginForm="ngForm">
<div class="form-group">
<div class="input-group">
<span class="input-group-addon" id="username-addon"><span class="glyphicon glyphicon-user"></span></span>
<input ng-if="LANG=='en'" type="text" class="form-control" id="login-username" name="username" placeholder="{{LANG=='fr' ? 'nom utilisateur' : 'username'}}" [(ngModel)]="credentials.username" value="" aria-describedby="username-addon" required>
</div></div>
<div class="form-group">
<div class="input-group">
<span class="input-group-addon" id="password-addon">
<span class="glyphicon glyphicon-lock"></span></span>
<input type="password" class="form-control" id="login-password" name="password" placeholder="{{LANG=='fr' ? 'mot de passe' : 'password'}}" [(ngModel)]="credentials.password" aria-describedby="password-addon" required>
</div></div>
<div class="form-group">&nbsp;
<button id='login-btn' type="submit" class="btn btn-success" [disabled]="!loginForm.form.valid">{{LANG=='fr' ? 'Connexion' : 'Login'}}</button>
</div></form>
<div *ngIf="error"><span class="alert alert-warning" title="{{error.code}}">{{error.reason}}</span></div></div>`
})
export class AuthLoginComponent {

    @Input() LANG = 'en';
    @Output() onLogin = new EventEmitter<boolean>();

    credentials = {};
    private error: Error = null;

    constructor(
        //private router: Router,
        private authService: AuthService) {
    }

    login(credentials) {
        //console.log("AuthLoginComponent::login(" + JSON.stringify(credentials) + ")");
        this.authService.login(credentials)
            .subscribe(
            json => this.handleLoginResponse(json),
            error => {
                if (error instanceof Error) {
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
                else {
                    console.error("AuthLoginComponent::login|" + error);
                    this.error = Error.build(-1, error);
                }
                this.onLogin.emit(false);
            }
            );
    }

    private handleLoginResponse(json: any) {
        //console.log("handleLoginResponse:" + JSON.stringify(json));
        this.authService.setSessionId(json.sessionId);
        this.authService.setAuthenticatedUser(json.user, json.userRoles);

        this.error = null;

        this.onLogin.emit(true);

        // Redirect the user
        // DO THIS IN onLogin implementation
        //let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
        //this.router.navigate([redirect]);
    }
}