//
// Author: Kevin Moyse
//
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from '../user';

@Component({
    selector: 'kwp-user-form',
    templateUrl: 'app/kwp/users/user-form.component.html',
})
export class UserFormComponent implements OnInit {

    newUser: boolean = false;
    user: User;
    error: any;
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
        this.userService.create(user)
            .then(() => {
                let link = ['activation'];
                console.debug("UserFormComponent::navigate(" + JSON.stringify(link) + ")");
                this.router.navigate(link);
            }).catch(error => this.auth.handleErrorResponse(error));
    }

    save(user: User) {
        this.userService.update(user)
            .then().catch(error => this.auth.handleErrorResponse(error));
    }

    //    goBack() {
    //        window.history.back();
    //    }
}