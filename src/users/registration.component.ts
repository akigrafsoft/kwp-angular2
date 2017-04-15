//
// Author: Kevin Moyse
//
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user';
import { Error } from '../services/error';

@Component({
    selector: 'kwp-registration',
    //    templateUrl: 'app/kwp/users/registration.component.html',
    template: `<form name="userRegistrationForm" class="form-horizontal" accept-charset="UTF-8" (ngSubmit)="onSubmit()" #f="ngForm">
 <div class="form-group">
  <label for="username">{{LANG==='fr' ? 'Nom utilisateur' : 'username'}}</label> <input name="username"
   [(ngModel)]="user.username" type="text" pattern="[a-zA-Z0-9.-_]+" class="form-control"
   placeholder="{{LANG==='fr' ? 'nomUtilisateur (sans espaces)' : 'username'}}" id="username" required #username="ngModel">
  <div class="alert alert-danger" [hidden]="username.valid || (username.pristine && !f.submitted)">{{LANG==='fr' ? "Le nom
   utilisateur est requis, il ne doit pas contenir d'espaces, ni d'accents, ni certains caractères spéciaux" : 'Username is
   required (no spaces, no accents)'}}</div>
 </div>
 <div class="form-group">
  <label for="email">Email</label> <input name="email" [(ngModel)]="user.email" type="email"
   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" class="form-control" placeholder="email" id="email" required>
  <p *ngIf="emailHelp" class="help-block">{{emailHelp}}</p>
 </div>
 <div class="form-group">
  <label for="firstName">{{LANG==='fr' ? 'Prénom' : 'First name'}}</label> <input name="firstName" [(ngModel)]="user.firstName"
   type="text" class="form-control" placeholder="{{LANG==='fr' ? 'Prénom' : 'First name'}}" id="firstName" required>
 </div>
 <div class="form-group">
  <label for="lastName">{{LANG==='fr' ? 'Nom' : 'Last name'}}</label> <input name="lastName" [(ngModel)]="user.lastName"
   type="text" class="form-control" placeholder="{{LANG==='fr' ? 'Nom' : 'Last name'}}" id="lastName" required>
 </div>
 <div *ngIf="withPhone" class="form-group">
  <label for="phone">{{LANG==='fr' ? 'Tél' : 'Phone'}}</label> <input name="phone" [(ngModel)]="user.phone" type="tel"
   pattern="^([0|\+[0-9]{1,5})?([1-9][0-9]{8})$" class="form-control"
   placeholder="{{LANG==='fr' ? 'Téléphone' : 'Phone number'}}" id="phone" required>
  <p *ngIf="phoneHelp" class="help-block">{{phoneHelp}}</p>
 </div>
 <div class="form-group">
  <label for="password">{{LANG==='fr' ? 'Mot de passe' : 'Password'}}</label> <input name="pw1" [(ngModel)]="user.password"
   type="password" pattern=".{6,}" class="form-control"
   placeholder="{{LANG==='fr' ? 'mot de passe (6 caractères min)' : 'password (6 characters min)'}}" id="pw1" required>
 </div>
 <div class="form-group">
  <label for="pw2">{{LANG==='fr' ? 'Confirmation mot de passe' : 'Retype password'}}</label><input name="pw2"
   [(ngModel)]="password2" type="password" pattern="{{user.password}}" class="form-control"
   placeholder="{{LANG==='fr' ? 're-tapez votre mot de passe' : 'type password again'}}" id="pw2" required #pw2="ngModel">
  <div class="alert alert-danger" [hidden]="pw2.valid || (pw2.pristine && !f.submitted)">{{LANG==='fr' ? 'Les mots de
   passe doivent être les mêmes' : 'Passwords should match'}}</div>
 </div>
 <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
 <button type="submit" class="btn btn-primary pull-right" [disabled]="!f.form.valid||inPrgs">{{LANG==='fr' ? 'Valider'
  : 'Register'}}</button>
</form>`,
    styles: [
        `.ng-valid[required], .ng-valid.required  {border-left: 5px solid #42A948;}`,
        `.ng-invalid:not(form)  {border-left: 5px solid #a94442;`
    ]
})
export class RegistrationComponent implements OnInit {

    @Input() LANG: string = 'en';
    @Input() withPhone: boolean = false;
    @Input() emailHelp: string = null;
    @Input() phoneHelp: string = null;
    @Input() roles: string[] = null;
    @Output() onSuccess = new EventEmitter<boolean>();

    user: User = new User();
    inPrgs: boolean = false;
    error: Error = null;

    password2: string;

    constructor(
        private userService: UserService,
        private auth: AuthService) {
    }

    ngOnInit() {
        if (this.roles !== null) {
            //console.debug("Registration::constructor|User with roles" + JSON.stringify(this.roles));
            this.user.roles = this.roles;
        }
    }

    onSubmit() {
        //console.debug("Registration::onSubmit()");
        this.inPrgs = true;
        this.userService.create(this.user)
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
                    console.error("Registration::onSubmit()|" + error);
                }
            });
    }
}