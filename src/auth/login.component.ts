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
                    name="username" placeholder="username"
                    [(ngModel)]="credentials.username" value=""
                    aria-describedby="username-addon" required>
                <!--                        kwp-auto-fill -->
                <!--                         <input -->
                <!--                        ng-if="LANG=='fr'" type="text" class="form-control" -->
                <!--                        id="login-username" name="username" -->
                <!--                        placeholder="nom d'utilisateur/e-mail" -->
                <!--                        ng-model="credentials.username" value="" kwp-auto-fill> -->
            </div>
        </div>
        <div class="form-group">
            <!--            <label class="sr-only" for="login-password">Password</label> -->
            <div class="input-group">
                <span class="input-group-addon" id="password-addon"><span
                    class="glyphicon glyphicon-lock"></span></span> <input type="password"
                    class="form-control" id="login-password" name="password"
                    placeholder="password" [(ngModel)]="credentials.password"
                    aria-describedby="password-addon" required>
            </div>
        </div>
        <!--            <a id="forgottenPassword" href -->
        <!--                ng-show="loginForm.error&&loginForm.username.$valid" -->
        <!--                kwp-confirm-condition="true" -->
        <!--                kwp-confirm-message="{{ LANG=='en' ? 'A new password will be sent over your e-mail, continue ?' : 'Un mot de passe temporaire va vous etre envoyé sur votre e-mail, êtes vous sûr de vouloir continuer?'}}" -->
        <!--                kwp-confirm-click="forgottenPassword()"><span ng-if="LANG=='en'">forgotten</span> -->
        <!--                <span ng-if="LANG=='fr'">oublié</span> ?</a> -->
        <div class="form-group">
            <!-- Button -->
            <!--                ng-if="!processing" -->
            <!--            <a id="btn-login" href="javascript:void(0)" class="btn btn-success" -->
            <!--                (click)="login(credentials)"> -->
            <!--                <span>Login</span> -->
            <!--                    <span ng-if="LANG=='fr'">Se connecter</span> -->
            &nbsp;
            <!--                     <img ng-show="processing" src="img/processing.gif" />  -->
            <!--            </a> -->
            <button type="submit" class="btn btn-success"
                [disabled]="!loginForm.form.valid">Login</button>
            <!--                     <small class="alert alert-warning" ng-show="loginForm.error.errorReason">{{loginForm.error.errorReason}}</small> -->
            <!--                <a ng-if="loginForm.error.errorCode==31" href="#/activation">Activation</a> -->
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