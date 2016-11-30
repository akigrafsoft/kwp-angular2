//
// Author: Kevin Moyse
//
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
    selector: 'auth-login',
    //    templateUrl: 'app/kwp/auth/login.component.html'
    template: `
<div>
    <form name="loginForm" class="form-inline enabled"
        accept-charset="UTF-8" (ngSubmit)="login(credentials)"
        #loginForm="ngForm">
        <div class="form-group">
            <div class="input-group">
                <span class="input-group-addon" id="username-addon"><span
                    class="glyphicon glyphicon-user"></span></span> <input ng-if="LANG=='en'"
                    type="text" class="form-control" id="login-username"
                    name="username"
                    placeholder="{{LANG=='fr' ? 'nom utilisateur' : 'username'}}" [(ngModel)]="credentials.username" value=""
                    aria-describedby="username-addon" required>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group">
                <span class="input-group-addon" id="password-addon"><span
                    class="glyphicon glyphicon-lock"></span></span> <input type="password"
                    class="form-control" id="login-password" name="password"
                    placeholder="{{LANG=='fr' ? 'mot de passe' : 'password'}}" [(ngModel)]="credentials.password"
                    aria-describedby="password-addon" required>
            </div>
        </div>
        <div class="form-group">
            &nbsp;
            <button type="submit" class="btn btn-success"
                [disabled]="!loginForm.form.valid">{{LANG=='fr' ? 'Connexion' : 'Login'}}</button>

        </div>
    </form>
    <div *ngIf="error">
        <span class="alert alert-warning">{{error.errorReason}}</span>
    </div>
    <div *ngIf="authenticatedUser">{{authenticatedUser.username}}</div>
</div>`

})
export class AuthLoginComponent {

    title = 'Login';

    credentials = {};

    error: any;

    @Input() LANG = 'en';

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