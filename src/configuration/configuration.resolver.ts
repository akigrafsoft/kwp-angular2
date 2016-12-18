//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigurationService } from './configuration.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ConfigurationResolver implements Resolve<any> {

    constructor(
        private configurationService: ConfigurationService,
        private authService: AuthService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {

        let sessionId: string = null;

        if (typeof this.authService.sessionId !== 'undefined' && this.authService.sessionId != null) {
            sessionId = this.authService.sessionId;
            console.log("ConfigurationResolver::resolve, this.auth.sessionId=" + sessionId);
            return null;
        }

        if (window.localStorage
            .getItem('sessionId') != null) {
            sessionId = window.localStorage
                .getItem('sessionId');
            console.log("ConfigurationResolver::resolve, localStorage.sessionId=" + sessionId);
        }

        return this.configurationService.getConfiguration(sessionId).then(response => this.handleResponse(response));
    }

    handleResponse(response) {
        console.debug("ConfigurationResolver::handleResponse(" + JSON.stringify(response) + ")");

        // sessionId
        window.localStorage
            .setItem(
            'sessionId',
            response.sessionId);

        // authenticatedUser
        if (response.user) {
            if (!this.authService.isLoggedIn) {
                this.authService.acceptAuthenticatedUser(response.sessionId, response.user, response.userRoles);
            }
        }

        // roles
        this.authService.roles = response.roles;
    }

}