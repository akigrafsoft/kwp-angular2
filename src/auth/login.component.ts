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
    template: `<div>
 <form name="loginForm" class="form-inline enabled" accept-charset="UTF-8" (ngSubmit)="login()" #f="ngForm">
  <div class="form-group">
   <div class="input-group">
    <span class="input-group-addon" id="username-addon"><span class="glyphicon glyphicon-user"></span></span> <input type="text"
     class="form-control" id="login-username" name="username" placeholder="{{_l=='fr' ? 'nom utilisateur' : 'username'}}"
     [(ngModel)]="username" value="" aria-describedby="username-addon" required>
   </div>
  </div>
  <div class="form-group">
   <div class="input-group">
    <span class="input-group-addon" id="password-addon"> <span class="glyphicon glyphicon-lock"></span></span> <input
     type="password" class="form-control" id="login-password" name="password"
     placeholder="{{_l=='fr' ? 'mot de passe' : 'password'}}" [(ngModel)]="password" aria-describedby="password-addon" required>
   </div>
  </div>
  <div class="form-group">
   &nbsp;
   <button id='login-btn' type="submit" class="btn btn-success" [disabled]="!f.form.valid">{{_l=='fr' ? 'Connexion' :
    'Login'}}</button>
  </div>
 </form>
 <div *ngIf="error">
  <span class="alert alert-warning" title="{{error.code}}">{{error.reason}}</span>
 </div>
</div>
<div>`
})
export class AuthLoginComponent {

    _l: string = 'en';
    @Input() set LANG(lang: string) {
        this._l = lang;
    }
    @Input() username: string = null;
    @Output() onLogin = new EventEmitter<boolean>();

    password: string = null;

    error: Error = null;

    constructor(
        private authService: AuthService) {
    }

    login() {
        this.authService.login({ username: this.username, password: this.password })
            .subscribe(
            json => {
                this.authService.setSessionId(json.sessionId);
                this.authService.setAuthenticatedUser(json.user, json.userRoles);
                this.error = null;
                this.onLogin.emit(true);
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
                else {
                    console.error("AuthLogin::login|" + error);
                    this.error = Error.build(-1, error);
                }
                this.onLogin.emit(false);
            }
            );
    }
}