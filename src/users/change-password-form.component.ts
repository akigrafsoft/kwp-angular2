//
// Author: Kevin Moyse
//
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PasswordService } from './password.service';
import { User } from './user';
import { Error } from '../services/error';

@Component({
    selector: 'kwp-change-pwd',
    //templateUrl: './change-password-form.component.html',
    template: `<form name="changePasswordForm" class="form-horizontal" accept-charset="UTF-8" (ngSubmit)="onSubmit()" #f="ngForm">
 <div class="form-group">
  <label for="cpwd">{{ _l==='fr' ? 'Mot de passe actuel' : 'Current Password'}}</label> <input name="cpwd" [(ngModel)]="_cpwd"
   type="password" pattern=".{6,}" class="form-control" placeholder="{{ _l==='fr' ? 'mot de passe' : 'password'}}" id="cpwd"
   required>
 </div>
 <div class="form-group">
  <label for="pw1">{{ _l==='fr' ? 'Nouveau mot de passe' : 'New Password'}}</label> <input name="pw1" [(ngModel)]="_pw1"
   type="password" pattern=".{6,}" class="form-control"
   placeholder="{{ _l==='fr' ? 'mot de passe (6 caractères min)' : 'password (6 characters min)'}}" id="pw1"
   required #pw1="ngModel">
  <div class="alert alert-danger" [hidden]="pw1.valid || (pw1.pristine && !f.submitted)">{{ _l==='fr' ? '6 caractères min'
   : '6 characters min'}}</div>
 </div>
 <div class="form-group">
  <label for="pw2">{{ _l==='fr' ? 'Confirmation mot de passe' : 'Retype password'}}</label><input name="pw2" [(ngModel)]="_pw2"
   type="password" pattern="{{_pw1}}" class="form-control"
   placeholder="{{ _l==='fr' ? 're-tapez votre mot de passe' : 'type password again'}}" id="pw2" required #pw2="ngModel">
  <div class="alert alert-danger" [hidden]="pw2.valid || (pw2.pristine && !f.submitted)">{{ _l==='fr' ? 'Les mots de passe
   doivent être les mêmes' : 'Passwords should match'}}</div>
 </div>
 <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
 <button type="submit" class="btn btn-primary pull-right" [disabled]="!f.form.valid||inPrgs">{{ _l==='fr' ? 'Valider' :
  'Ok'}}</button>
</form>`,
    styles: [
        `.ng-valid[required], .ng-valid.required  {border-left: 5px solid #42A948;}`,
        `.ng-invalid:not(form)  {border-left: 5px solid #a94442;`
    ]
})
export class ChangePasswordFormComponent implements OnInit {

    _l: string = 'en';
    @Input() set LANG(lang: string) {
        this._l = lang;
    }
    @Input() user: User = null;
    @Output() onSuccess = new EventEmitter<boolean>();

    _cpwd: string;
    _pw1: string;
    _pw2: string;

    inPrgs: boolean = false;
    error: Error = null;

    constructor(
        private passwordService: PasswordService) {
    }

    ngOnInit() {
    }

    onSubmit() {
        //console.debug("Registration::onSubmit()");
        this.inPrgs = true;
        this.passwordService.changePassword(this.user, this._cpwd, this._pw1)
            .subscribe(() => {
                this.inPrgs = false;
                this.onSuccess.emit(true);
            },
            error => {
                this.inPrgs = false;
                if (error instanceof Error) {
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
                else {
                    console.error("ChangePassword::onSubmit()|" + error);
                }
            });
    }
}