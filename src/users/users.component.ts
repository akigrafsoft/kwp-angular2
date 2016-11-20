//
// Author: Kevin Moyse
//
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { UserFormComponent } from './user-form.component';
import { PagedListDirective } from '../pagedlist/pagedlist.directive';

import { UserService } from './user.service';
import { User } from '../user';

@Component({
    selector: 'my-users',
    templateUrl: 'app/kwp/users/users.component.html',
    styleUrls: ['app/kwp/users/users.component.css']
})

export class UsersComponent {
    title = 'Users';

    error: any;

    @ViewChild(PagedListDirective)
    private pagedList: PagedListDirective;

    constructor(private router: Router,
        private auth: AuthService,
        private userService: UserService) {
    }

    onSelect(user: User) {
        console.debug("UsersComponent::onSelect(" + JSON.stringify(user) + ")");
        let link = ['user', user.username];
        this.router.navigate(link);
    }

    onDelete(user: User, event) {
        console.debug("UsersComponent::onDelete(" + JSON.stringify(user) + ")");
        this.userService.del(user.username)
            .then(() => this.pagedList.refreshList())
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    searchUsername(username: string) {
        console.debug("EnvironmentsComponent::searchUsername(" + username + ")");
        if (username === '') {
            this.pagedList.search(null);
        }
        else {
            this.pagedList.search({ 'username': username });
        }
    }

    private handleErrorResponse(response) {
        console.debug("EnvironmentsComponent::handleErrorResponse(" + JSON.stringify(response) + ")");
        this.error = {
            errorCode: response.errorCode,
            errorReason: response.errorReason
        };

        setTimeout(() => {
            this.error = null;
        }, 3000);
    }

}
