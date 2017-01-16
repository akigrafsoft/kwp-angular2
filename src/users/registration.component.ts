//
// Author: Kevin Moyse
//
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user';

@Component({
    selector: 'kwp-registration',
    //    templateUrl: 'app/kwp/users/registration.component.html',
    template: `<form name="userRegistrationForm" class="form-horizontal"
    accept-charset="UTF-8" (ngSubmit)="onSubmit()" #f="ngForm">
    <div class="form-group">
        <label for="username">{{LANG=='fr' ? 'Nom utilisateur' : 'username'}}</label> <input name="username"
            [(ngModel)]="user.username" type="text" pattern="[a-zA-Z0-9.-_]+" class="form-control"
            placeholder="{{LANG=='fr' ? 'nomUtilisateur (sans espaces)' : 'username'}}" id="username" required #username="ngModel">
        <div class="alert alert-danger" [hidden]="username.valid || (username.pristine && !f.submitted)">
            {{LANG=='fr' ? "Le nom utilisateur est requis, il ne doit pas contenir d'espaces" : 'Username is required (no spaces)'}}
        </div>
    </div>
    <div class="form-group">
        <label for="email">Email</label> <input name="email"
            [(ngModel)]="user.email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" class="form-control"
            placeholder="email" id="email" required>
    </div>
    <div class="form-group">
        <label for="firstName">{{LANG=='fr' ? 'Prénom' : 'First name'}}</label> <input name="firstName"
            [(ngModel)]="user.firstName" type="text" class="form-control"
            placeholder="{{LANG=='fr' ? 'Prénom' : 'First name'}}" id="firstName" required>
    </div>
    <div class="form-group">
        <label for="lastName">{{LANG=='fr' ? 'Nom' : 'Last name'}}</label> <input name="lastName"
            [(ngModel)]="user.lastName" type="text" class="form-control"
            placeholder="{{LANG=='fr' ? 'Nom' : 'Last name'}}" id="lastName" required>
    </div>
    <div class="form-group">
        <label for="password">{{LANG=='fr' ? 'Mot de passe' : 'Password'}}</label> <input name="pw1"
            [(ngModel)]="user.password" type="password" pattern=".{6,}" class="form-control"
            placeholder="{{LANG=='fr' ? 'mot de passe (6 caractères min)' : 'password (6 characters min)'}}" id="pw1" required>
    </div>
    <div class="form-group">
        <label for="pw2">{{LANG=='fr' ? 'Confirmation mot de passe' : 'Retype password'}}</label><input name="pw2"
            [(ngModel)]="password2" type="password" pattern="{{user.password}}" class="form-control"
            placeholder="{{LANG=='fr' ? 'vérifier mot de passe' : 'verify password'}}" id="pw2" required #pw2="ngModel">
        <div class="alert alert-danger" [hidden]="pw2.valid || (pw2.pristine && !f.submitted)">
            {{LANG=='fr' ? 'Les mots de passe doivent être les mêmes' : 'Passwords should match'}}
        </div>
    </div>
    <button type="submit" class="btn btn-default"
        [disabled]="!f.form.valid">{{LANG=='fr' ? 'Valider' : 'Register'}}</button>
</form>`,
    styles: [
        `.ng-valid[required], .ng-valid.required  {border-left: 5px solid #42A948;}`,
        `.ng-invalid:not(form)  {border-left: 5px solid #a94442;`
    ]
})
export class RegistrationComponent implements OnInit {

    @Input() LANG: string = 'en';

    @Input() roles: string[] = null;

    private user: User = new User();

    constructor(private router: Router,
        private userService: UserService,
        private auth: AuthService) {
    }

    ngOnInit() {
        if (this.roles !== null) {
            console.debug("RegistrationComponent::constructor|User with roles" + JSON.stringify(this.roles));
            this.user.roles = this.roles;
        }
    }

    onSubmit() {
        console.debug("RegistrationComponent::onSubmit()");
        this.userService.create(this.user)
            .then(() => {
                let link = ['activation'];
                //console.debug("RegistrationComponent::navigate(" + JSON.stringify(link) + ")");
                this.router.navigate(link);
            }).catch(error => this.auth.handleErrorResponse(error));
    }
}