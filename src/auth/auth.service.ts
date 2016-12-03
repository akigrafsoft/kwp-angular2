//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import { User } from '../users/user';
import { Role } from './role';

@Injectable()
export class AuthService {

    public sessionId: string;

    // All existing role names...
    roles: Array<string>;

    public authenticatedUser: User = null;
    private user = new Subject<User>();
    authUser$: Observable<User> = this.user.asObservable();

    authenticatedRoles: Array<Role>;

    constructor(private http: Http, private baseUrl: string) { }

    public getAuthenticatedUser(): User {
        return this.authenticatedUser;
    }

    public getAuthenticatedRoles(): Array<Role> {
        return this.authenticatedRoles;
    }

    public getAllRolesNames(): Array<string> {
        return this.roles;
    }

    announceUser(user: User) {
        this.user.next(user);
    }

    login(credentials: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.sessionId
        });
        return this.http.post(this.baseUrl, JSON.stringify(credentials), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    logout(sessionId: string) {
        let headers = new Headers({
            'SessionId': this.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    public isAuthenticated(userName: string): boolean {
        return (this.authenticatedUser && this.authenticatedUser.username === userName);
    }

    public isAllowed(i_right: string): boolean {
        if (!this.authenticatedUser)
            return false;
        if (!this.authenticatedRoles)
            return false;

        for (var role of this.authenticatedRoles) {
            for (var right of role.frontendRights) {
                if (right === 'all')
                    return true;
                if (i_right === right)
                    return true;
            }
        }
        return false;
    }

    public hasRole(i_role: string): boolean {
        if (!this.authenticatedUser)
            return false;
        if (!this.authenticatedRoles)
            return false;

        for (var role of this.authenticatedRoles) {
            if (i_role === role.name)
                return true;
        }

        return false;
    }

    /**
     * Takes the promise response Object (do not provide it as json !)
     */
    public handleErrorResponse(response: Response) {
        console.debug("AuthService::handleErrorResponse(" + JSON.stringify(response) + ")");
        let status = +response.status;
        if (status == 403) {
            // TODO : does not work well when the request was getting a ResponseType blob
            // maybe we should check for the type ? 
            //let error = response.json();
            //console.log("AuthService::handleError(status:" + status + ") error:" + JSON.stringify(error));
        } else if (status == 419) {
            this.sessionId = null;
            this.authenticatedUser = null;
            location.reload();
        } else
        { console.warn("AuthService::handleErrorResponse(" + JSON.stringify(response) + ")|unknown status:" + status); }
    }

    private handleError(response: any) {
        //this.handleStatus(response);
        console.error('AuthService::handleError|An error occurred', response);
        return Promise.reject(response.message || response);
    }
}
