//
// Author: Kevin Moyse
//
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user';

@Component({
    selector: 'kwp-registration',
    //    templateUrl: 'app/kwp/users/registration.component.html',
    template: `
<form name="userRegistrationForm" class="form-horizontal"
    accept-charset="UTF-8" (ngSubmit)="onSubmit()"
    #registrationForm="ngForm">
    <div class="form-group">
        <label for="username" class="col-sm-2 control-label">Username</label>
        <div class="col-lg-4 col-md-6 col-sm-10">
            <input name="username" [(ngModel)]="user.username" type="text"
                class="form-control" placeholder="username" id="username" required>
        </div>
    </div>
    <div class="form-group">
        <label for="email" class="col-sm-2 control-label">Email</label>
        <div class="col-lg-4 col-md-6 col-sm-10">
            <input name="email" [(ngModel)]="user.email" type="email"
                class="form-control" placeholder="email" id="email" required>
        </div>
    </div>
    <div class="form-group">
        <label for="firstName" class="col-sm-2 control-label">FirstName</label>
        <div class="col-lg-4 col-md-6 col-sm-10">
            <input name="firstName" [(ngModel)]="user.firstName" type="text"
                class="form-control" placeholder="FirstName" id="firstName" required>
        </div>
    </div>
    <div class="form-group">
        <label for="lastName" class="col-sm-2 control-label">LastName</label>
        <div class="col-lg-4 col-md-6 col-sm-10">
            <input name="lastName" [(ngModel)]="user.lastName" type="text"
                class="form-control" placeholder="LastName" id="lastName" required>
        </div>
    </div>
    <div class="form-group">
        <label for="password" class="col-sm-2 control-label">Password</label>
        <div class="col-lg-4 col-md-6 col-sm-10">
            <div id="password">
                <input name="pw1" [(ngModel)]="user.password" type="password"
                    class="form-control" placeholder="password" required> <input
                    name="pw2" [(ngModel)]="password2" type="password"
                    class="form-control" placeholder="password" required>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-offset-2 col-lg-4 col-md-6 col-sm-10">
            <button type="submit" class="btn btn-default"
                [disabled]="!registrationForm.form.valid">Register</button>
        </div>
    </div>
</form>`
})
export class RegistrationComponent {

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