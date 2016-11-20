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
    constructor(private configurationService: ConfigurationService, private auth: AuthService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {

        let sessionId: string = null;

        if (typeof this.auth.sessionId !== 'undefined' && this.auth.sessionId != null) {
            sessionId = this.auth.sessionId;
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
        this.auth.sessionId = response.sessionId;
        window.localStorage
            .setItem(
            'sessionId',
            response.sessionId);

        // authenticatedUser
        if (response.user) {
            this.auth.authenticatedUser = response.user;
            this.auth.authenticatedRoles = response.userRoles;
        }

        // roles
        this.auth.roles = response.roles;
    }

}