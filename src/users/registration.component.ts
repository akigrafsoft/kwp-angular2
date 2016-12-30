//
// Author: Kevin Moyse
//
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user';

@Component({
    selector: 'kwp-registration',
    //    templateUrl: 'app/kwp/users/registration.component.html',
    //    template: `<form name="userRegistrationForm" class="form-horizontal" accept-charset="UTF-8" (ngSubmit)="onSubmit()" #registrationForm="ngForm">
    //<div class="form-group">
    //<label for="username" class="col-sm-2 control-label">Username</label>
    //<div class="col-lg-4 col-md-6 col-sm-10">
    //<input name="username" [(ngModel)]="user.username" type="text" class="form-control" placeholder="username" id="username" required></div></div>
    //<div class="form-group">
    //<label for="email" class="col-sm-2 control-label">Email</label>
    //<div class="col-lg-4 col-md-6 col-sm-10">
    //<input name="email" [(ngModel)]="user.email" type="email" class="form-control" placeholder="email" id="email" required></div></div>
    //<div class="form-group">
    //<label for="firstName" class="col-sm-2 control-label">FirstName</label>
    //<div class="col-lg-4 col-md-6 col-sm-10">
    //<input name="firstName" [(ngModel)]="user.firstName" type="text" class="form-control" placeholder="FirstName" id="firstName" required></div></div>
    //<div class="form-group">
    //<label for="lastName" class="col-sm-2 control-label">LastName</label>
    //<div class="col-lg-4 col-md-6 col-sm-10">
    //<input name="lastName" [(ngModel)]="user.lastName" type="text" class="form-control" placeholder="LastName" id="lastName" required></div></div>
    //<div class="form-group">
    //<label for="password" class="col-sm-2 control-label">Password</label>
    //<div class="col-lg-4 col-md-6 col-sm-10">
    //<div id="password">
    //<input name="pw1" [(ngModel)]="user.password" type="password" class="form-control" placeholder="password" required>
    //<input name="pw2" [(ngModel)]="password2" type="password" class="form-control" placeholder="password" required>
    //</div></div></div>
    //<div class="form-group">
    //<div class="col-sm-offset-2 col-lg-4 col-md-6 col-sm-10">
    //<button type="submilass="btn btn-default" [disabled]="!registrationForm.form.valid">Register</button></div></div></form>`

    template: `<form name="userRegistrationForm" class="form-horizontal"
    accept-charset="UTF-8" (ngSubmit)="onSubmit()"
    #registrationForm="ngForm">
    <div class="form-group">
        <label for="username">{{LANG=='fr' ? 'Nom utilisateur' : 'username'}}</label> <input name="username"
            [(ngModel)]="user.username" type="text" class="form-control"
            placeholder="{{LANG=='fr' ? 'nom utilisateur' : 'username'}}" id="username" required>
    </div>
    <div class="form-group">
        <label for="email">Email</label> <input name="email"
            [(ngModel)]="user.email" type="email" class="form-control"
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
            [(ngModel)]="user.password" type="password" class="form-control"
            placeholder="{{LANG=='fr' ? 'mot de passe' : 'password'}}" id="pw1" required>
    </div>
    <div class="form-group">
        <label for="pw2">{{LANG=='fr' ? 'Confirmation mot de passe' : 'Retype password'}}</label><input name="pw2"
            [(ngModel)]="password2" type="password" class="form-control"
            placeholder="{{LANG=='fr' ? 'vérifier mot de passe' : 'verify password'}}" id="pw2" required>
    </div>
    <button type="submit" class="btn btn-default"
        [disabled]="!registrationForm.form.valid">{{LANG=='fr' ? 'Valider' : 'Register'}}</button>
</form>`

})
export class RegistrationComponent {

    @Input() LANG = 'en';

    user: User;

    constructor(private router: Router,
        private userService: UserService,
        private auth: AuthService) {
        //this.user = { address: {}, roles: [] };
        this.user = new User();
    }

    onSubmit() {
        console.debug("RegistrationComponent::onSubmit()");
        this.userService.create(this.user)
            .then(() => {
                let link = ['activation'];
                console.debug("RegistrationComponent::navigate(" + JSON.stringify(link) + ")");
                this.router.navigate(link);
            }).catch(error => this.auth.handleErrorResponse(error));
    }
}