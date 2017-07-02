//
// Author: Kevin Moyse
//
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//import { ActivatedRoute, Params } from '@angular/router';
//import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Address } from './address';
import { User } from './user';
import { Error } from '../services/error';

@Component({
    selector: 'kwp-user-form',
    //    templateUrl: 'app/kwp/users/user-form.component.html',
    template: `<form *ngIf="_user" name="userForm" class="form-horizontal" accept-charset="UTF-8" (ngSubmit)="onSubmit()" #userForm="ngForm">
 <div class="form-group">
  <label for="username" class="col-sm-2 control-label">{{_l==='fr' ? 'Utilisateur' : 'Username'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <input name="username" [(ngModel)]="_user.username" type="text" class="form-control" placeholder="username" id="username"
    required="newUser" disabled="!newUser">
  </div>
 </div>
 <div class="form-group" *ngIf="!newUser">
  <label for="activationTime" class="col-sm-2 control-label">{{_l==='fr' ? 'Date activation' : 'ActivationTime'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <span id="activationTime">{{_user.activationTimeMillis}}</span>
  </div>
 </div>
 <div class="form-group">
  <label for="email" class="col-sm-2 control-label">Email</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <input name="email" [(ngModel)]="_user.email" type="email" class="form-control" placeholder="email" id="email"
    [required]="newUser">
  </div>
 </div>
 <div class="form-group">
  <label for="firstName" class="col-sm-2 control-label">{{_l==='fr' ? 'Prénom' : 'Firstname'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <input name="firstName" [(ngModel)]="_user.firstName" type="text" class="form-control" placeholder="FirstName" id="firstName"
    required="newUser">
  </div>
 </div>
 <div class="form-group">
  <label for="lastName" class="col-sm-2 control-label">{{_l==='fr' ? 'Nom' : 'LastName'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <input name="lastName" [(ngModel)]="_user.lastName" type="text" class="form-control" placeholder="LastName" id="lastName"
    required="newUser">
  </div>
 </div>
 <div class="form-group">
  <label for="phone" class="col-sm-2 control-label">{{_l==='fr' ? 'Téléphone' : 'Phone'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <input name="phone" [(ngModel)]="_user.phone" type="tel" class="form-control" placeholder="Phone" id="phone"
    required="newUser">
  </div>
 </div>
 <div class="form-group">
  <label for="address" class="col-sm-2 control-label">{{_l==='fr' ? 'Adresse' : 'Address'}}</label>
  <div class="col-lg-6 col-md-6 col-sm-10" id="address">
   <div class="form-group">
    <label for="line1" class="col-md-4 control-label">{{_l==='fr' ? 'Ligne1' : 'Line1'}}</label>
    <div class="col-md-8">
     <input name="line1" type="text" id="line1" [(ngModel)]="_user.address.line1" ng-disabled="!editing" />
    </div>
   </div>
   <div class="form-group">
    <label for="line2" class="col-md-4 control-label">{{_l==='fr' ? 'Ligne2' : 'Line2'}}</label>
    <div class="col-md-8">
     <input name="line2" type="text" id="line2" [(ngModel)]="_user.address.line2" ng-disabled="!editing" />
    </div>
   </div>
   <div class="form-group">
    <label for="postalCode" class="col-md-4 control-label">{{_l==='fr' ? 'Code postal' : 'Postal code'}}</label>
    <div class="col-md-8">
     <input name="postalCode" type="text" id="postalCode" [(ngModel)]="_user.address.postalCode" ng-disabled="!editing" />
    </div>
   </div>
   <div class="form-group">
    <label for="town" class="col-md-4 control-label">{{_l==='fr' ? 'Ville' : 'Town'}}</label>
    <div class="col-md-8">
     <input name="town" type="text" id="town" [(ngModel)]="_user.address.town" ng-disabled="!editing" />
    </div>
   </div>
   <div class="form-group">
    <label for="province" class="col-md-4 control-label">{{_l==='fr' ? 'Région' : 'Region'}}</label>
    <div class="col-md-8">
     <input name="province" type="text" id="province" [(ngModel)]="_user.address.province" ng-disabled="!editing" />
    </div>
   </div>
   <div class="form-group">
    <label for="state" class="col-md-4 control-label">{{_l==='fr' ? 'Pays' : 'Country'}}</label>
    <div class="col-md-8">
     <input name="state" type="text" id="state" [(ngModel)]="_user.address.state" ng-disabled="!editing" />
    </div>
   </div>
  </div>
 </div>
 <div class="form-group">
  <label for="roles" class="col-sm-2 control-label">Roles</label>
  <div class="col-lg-4 col-md-6 col-sm-10" id="roles">
   <ul class="list-group">
    <li class="list-group-item" *ngFor="let role of _user.roles">{{role}}<span class="glyphicon glyphicon-remove"
     aria-hidden="true" (click)="_user.roles.splice(_user.roles.indexOf(role),1)"></span></li>
    <li class="list-group-item"><select name="role" [(ngModel)]="roleName"
     (ngModelChange)="_user.roles.push($event);rolename='';">
      <option *ngFor="let name of roles">{{name}}</option>
    </select></li>
   </ul>
  </div>
 </div>
 <div class="form-group">
  <label for="password" class="col-sm-2 control-label">{{_l==='fr' ? 'Mot de passe' : 'Password'}}</label>
  <div class="col-lg-4 col-md-6 col-sm-10">
   <div id="password">
    <input name="pw1" [(ngModel)]="_user.password" type="password" class="form-control" placeholder="password"
     [required]="newUser"> <input name="pw2" [(ngModel)]="password2" type="password" class="form-control"
     placeholder="password" [required]="newUser">
   </div>
  </div>
 </div>
 <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
 <button type="submit" class="btn btn-success" [disabled]="!userForm.form.valid">Ok</button>
 <button class="btn btn-default" (click)="doCancel()">Cancel</button>
</form>`
})
export class UserFormComponent implements OnInit {

    _l: string = 'en';
    @Input() set LANG(l: string) {
        this._l = l;
    }

    @Output() onUpdated = new EventEmitter<User>();
    @Output() onCancelled = new EventEmitter<boolean>();

    newUser: boolean = false;

    _user: User;
    @Input() set user(user: User) {
        if (user === null) {
            this.newUser = true;
            this._user = new User();
        }
        else {
            this.newUser = false;
            this._user = user;
        }

        if (this._user.address === null)
            this._user.address = new Address();
    }

    roles: any;

    error: Error = null;

    constructor(
        private authService: AuthService,
        private userService: UserService) {
        this.roles = this.authService.roles;
    }

    ngOnInit() {
        console.log("UserForm::ngOnInit()");
        //        this.route.params.forEach((params: Params) => {
        //            let username = params['username'];
        //            if (typeof username !== 'undefined') {
        //                console.log("UserForm::ngOnInit: username=" + username);
        //                this.userService.getUser(username)
        //                    .subscribe(user => this.doSetUser(user),
        //                    error => { }
        //                    );
        //            }
        //            else {
        //                this.doSetNewUser();
        //            }
        //        });
    }

    addRolebyName(roleName) {
        this._user.roles.push(roleName);
    }

    removeRolebyName(roleName) {
        var index = this._user.roles.indexOf(roleName);
        if (index > -1) {
            this._user.roles.splice(index, 1);
        }
    }

    onSubmit() {
        //console.debug("UserForm::onSubmit(" + JSON.stringify(this._user) + ")");
        if (!this.newUser) {
            this.userService.update(this._user)
                .subscribe(json => {
                    //console.debug("UserForm::update() ok");
                    this.onUpdated.emit(User.build(json.user));
                },
                error => {
                    if (error instanceof Error) {
                        this.error = error;
                    }
                });
        }
    }

    //    create(user: User) {
    //        user.id = user.username;
    //        this.userService.create(user)
    //            .subscribe(() => {
    //                let link = ['activation'];
    //                //console.debug("UserForm::navigate(" + JSON.stringify(link) + ")");
    //                this.router.navigate(link);
    //            },
    //            error => {
    //                if (error instanceof Error) {
    //                    this.error = error;
    //                    setTimeout(() => {
    //                        this.error = null;
    //                    }, 3000);
    //                }
    //                else {
    //                    console.error("UserForm::create|" + error);
    //                }
    //            });
    //    }

    doCancel() {
        this.onCancelled.emit(true);
    }
}