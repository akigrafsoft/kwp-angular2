//
// Author: Kevin Moyse
//
import {Component, Input, EventEmitter, Output} from '@angular/core';

import {AuthService} from './auth.service';
import {Error} from '../services/error';

@Component({
  selector: 'auth-login',
  template: `<form name="loginForm" [class.form-inline]="inline" accept-charset="UTF-8" (ngSubmit)="login()" #f="ngForm">
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
 <div class="form-group" [class.clearfix]="!inline">
  <button id='login-btn' type="submit" class="btn btn-success" [class.pull-right]="!inline" [disabled]="!f.form.valid">{{_l=='fr'
   ? 'Connexion' : 'Login'}}</button>
 </div>
 <div *ngIf="error">
  <span class="alert alert-warning" title="{{error.code}}">{{error.reason}}</span>
 </div>
</form>`
})
export class AuthLoginComponent {

  _l: string = 'en';
  @Input() set LANG(lang: string) {
    this._l = lang;
  }
  @Input() username: string = null;
  @Input() inline: boolean = false;
  @Output() onLogin = new EventEmitter<boolean>();
  @Output() onError = new EventEmitter<boolean>();

  password: string = null;

  error: Error = null;

  constructor(
    private authService: AuthService) {
  }

  public getUsername(): string {
    return this.username;
  }

  login() {
    //console.debug('AuthLogin');
    this.authService.login({username: this.username, password: this.password})
      .subscribe(
      json => {
        this.authService.setSessionId(json.sessionId);
        this.authService.setAuthenticatedUser(json.user, json.userRoles);
        this.error = null;
        this.onLogin.emit(json.tmpPasswordUsed);
      },
      error => {
        this.password = null;
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
        this.onError.emit(true);
      }
      );
  }
}