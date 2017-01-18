//
// Author: Kevin Moyse
//
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from './user';
import { Error } from '../services/error';

@Component({
    selector: 'kwp-user-form',
    //    templateUrl: 'app/kwp/users/user-form.component.html',
    template: `<form *ngIf="user" name="userForm" class="form-horizontal" accept-charset="UTF-8" (ngSubmit)="onSubmit()" #userForm="ngForm">
<div class="form-group">
<label for="username" class="col-sm-2 control-label">Username</label>
<div class="col-lg-4 col-md-6 col-sm-10">
<input name="username" [(ngModel)]="user.username" type="text" class="form-control" placeholder="username" id="username" required="newUser" disabled="!newUser">
</div></div>
<div class="form-group" *ngIf="!newUser">
<label for="activationTime" class="col-sm-2 control-label">ActivationTime</label>
<div class="col-lg-4 col-md-6 col-sm-10"><span id="activationTime">{{user.activationTimeMillis}}</span></div>
</div>
<div class="form-group">
<label for="email" class="col-sm-2 control-label">Email</label>
<div class="col-lg-4 col-md-6 col-sm-10">
<input name="email" [(ngModel)]="user.email" type="email" class="form-control" placeholder="email" id="email" [required]="newUser"></div>
</div>
<div class="form-group">
<label for="firstName" class="col-sm-2 control-label">FirstName</label>
<div class="col-lg-4 col-md-6 col-sm-10">
<input name="firstName" [(ngModel)]="user.firstName" type="text" class="form-control" placeholder="FirstName" id="firstName" required="newUser">
</div></div>
<div class="form-group">
<label for="lastName" class="col-sm-2 control-label">LastName</label>
<div class="col-lg-4 col-md-6 col-sm-10">
<input name="lastName" [(ngModel)]="user.lastName" type="text" class="form-control" placeholder="LastName" id="lastName" required="newUser">
</div></div>
<div class="form-group">
<label for="address" class="col-sm-2 control-label">Address</label>
<div class="col-lg-6 col-md-6 col-sm-10" id="address">
<div class="form-group">
<label for="addressLine1" class="col-md-4 control-label">Ligne adresse 1</label>
<div class="col-md-8">
<input name="addressLine1" type="text" id="addressLine1" [(ngModel)]="user.address.addressLine1" ng-disabled="!editing" />
</div></div>
<div class="form-group">
<label for="addressLine2" class="col-md-4 control-label">Ligne adresse 2</label>
<div class="col-md-8">
<input name="addressLine2" type="text" id="addressLine2" [(ngModel)]="user.address.addressLine2" ng-disabled="!editing" />
</div></div>
<div class="form-group">
<label for="postalCode" class="col-md-4 control-label">Code postal</label>
<div class="col-md-8">
<input name="postalCode" type="text" id="postalCode" [(ngModel)]="user.address.postalCode" ng-disabled="!editing" />
</div></div>
<div class="form-group">
<label for="town" class="col-md-4 control-label">Ville</label>
<div class="col-md-8"> <input name="town" type="text" id="town" [(ngModel)]="user.address.town" ng-disabled="!editing" />
</div></div>
<div class="form-group">
<label for="province" class="col-md-4 control-label">Région</label>
<div class="col-md-8">
<input name="province" type="text" id="province" [(ngModel)]="user.address.province" ng-disabled="!editing" />
</div></div>
<div class="form-group">
<label for="state" class="col-md-4 control-label">Pays</label>
<div class="col-md-8">
<input name="state" type="text" id="state" [(ngModel)]="user.address.state" ng-disabled="!editing" />
</div></div></div></div>
<div class="form-group">
<label for="roles" class="col-sm-2 control-label">Roles</label>
<div class="col-lg-4 col-md-6 col-sm-10" id="roles">
<ul class="list-group">
<li class="list-group-item" *ngFor="let role of user.roles">{{role}}<span class="glyphicon glyphicon-remove" aria-hidden="true" (click)="user.roles.splice(user.roles.indexOf(role),1)"></span></li>
<li class="list-group-item"><select name="role" [(ngModel)]="roleName" (ngModelChange)="user.roles.push($event);rolename='';">
<option *ngFor="let name of roles">{{name}}</option>
</select></li>
</ul></div></div>
<div class="form-group">
<label for="password" class="col-sm-2 control-label">Password</label>
<div class="col-lg-4 col-md-6 col-sm-10">
<div id="password">
<input name="pw1" [(ngModel)]="user.password" type="password" class="form-control" placeholder="password" [required]="newUser">
<input name="pw2" [(ngModel)]="password2" type="password" class="form-control" placeholder="password" [required]="newUser">
</div></div></div>
<div class="form-group">
<div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
<div class="col-sm-offset-2 col-lg-4 col-md-6 col-sm-10">
<button type="submit" class="btn btn-default" [disabled]="!userForm.form.valid">Ok</button>
</div></div></form>`
})
export class UserFormComponent implements OnInit {

    newUser: boolean = false;
    user: User;
    private error: Error = null;
    roles: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private auth: AuthService) {
        this.roles = this.auth.roles;
    }

    ngOnInit() {
        console.log("UserFormComponent::ngOnInit()");
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            if (typeof id !== 'undefined') {
                console.log("UserFormComponent::ngOnInit: id=" + id);
                this.userService.getUser(id)
                    .then(user => this.doSetUser(user))
                    .catch(error => this.auth.handleErrorResponse(error));
            }
            else {
                this.doSetNewUser();
            }
        });
    }

    private doSetNewUser() {
        this.newUser = true;
        //this.user = { address: {}, roles: [] };
        this.user = new User();
    }

    private doSetUser(user: User) {
        if (user.address == null) {
            user.address = {};
        }
        this.user = user;
    }

    addRolebyName(roleName) {
        this.user.roles.push(roleName);
    }

    removeRolebyName(roleName) {
        var index = this.user.roles.indexOf(roleName);
        if (index > -1) {
            this.user.roles.splice(index, 1);
        }
    }

    onSubmit() {
        console.debug("UserFormComponent::onSubmit(" + JSON.stringify(this.user) + ")");
        if (!this.newUser) {
            this.userService.update(this.user).then(() => {
                console.debug("UserFormComponent::update() ok");
            }).catch(error => this.auth.handleErrorResponse(error));
        }
    }

    create(user: User) {
        user.id = user.username;
        this.userService.create(user)
            .then(() => {
                let link = ['activation'];
                console.debug("UserFormComponent::navigate(" + JSON.stringify(link) + ")");
                this.router.navigate(link);
            }).catch(resp => {
                this.auth.handleErrorResponse(resp);
                let body = resp.json() || null;
                if (body !== null)
                    this.error = Error.build(body.errorCode || -1, body.errorReason);
            });
    }

    save(user: User) {
        this.userService.update(user)
            .then().catch(error => this.auth.handleErrorResponse(error));
    }

    //    goBack() {
    //        window.history.back();
    //    }
}