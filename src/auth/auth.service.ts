//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';

//import 'rxjs/add/operator/toPromise';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';
//import { Subject }    from 'rxjs/Subject';

import { User } from '../users/user';
import { Role } from './role';

@Injectable()
export class AuthService {

    public sessionId: string;

    // All existing role names...
    roles: Array<string>;

    public isLoggedIn: boolean = false;
    public authenticatedUser: User = null;
    public authenticatedRoles: Array<Role>;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

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

    private extractData(res: Response): any {
        let body = res.json();
        return body || {};
    }

    public login(credentials: any): Observable<any> {

        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.sessionId
        });
        //        return this.http.post(this.baseUrl, JSON.stringify(credentials), { headers: headers })
        //            .toPromise()
        //            .then(this.extractData)
        //            .catch(this.handleError);
        return this.http.post(this.baseUrl, JSON.stringify(credentials), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    //    public doLogin(credentials: any) {
    //        return Observable.from(this.login(credentials)).subscribe();
    //    }

    public successLogin(data: any): void {
        window.localStorage
            .setItem(
            'sessionId',
            data.sessionId);

        this.isLoggedIn = true;
        this.sessionId = data.sessionId;
        this.authenticatedUser = data.user;
        this.authenticatedRoles = data.userRoles;
    }

    logout(sessionId: string) {
        let headers = new Headers({
            'SessionId': this.sessionId
        });
        //        return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
        //            .toPromise()
        //            .then(res => res.json())
        //            .catch(this.handleError);
        return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public successLogout(): void {
        window.localStorage
            .removeItem(
            'sessionId');

        this.isLoggedIn = false;
        this.sessionId = null;
        this.authenticatedUser = null;
    }


    //    .subscribe(data => { this.isLoggedIn = false;    
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

    //    private handleError(response: any) {
    //        //this.handleStatus(response);
    //        console.error('AuthService::handleError|An error occurred', response);
    //        return Promise.reject(response.message || rese);
    //    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("AuthService::handleError|" + errMsg);
        return Observable.throw(errMsg);
    }
}
