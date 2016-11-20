//
// Author: Kevin Moyse
//
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from '../user';

@Component({
    selector: 'kwp-registration',
    templateUrl: 'app/kwp/users/registration.component.html',
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