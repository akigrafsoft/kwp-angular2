//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { Subject }    from 'rxjs/Subject';

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

    private userAuthenticationSubject = new Subject<User>();
    public userAuthentication$ = this.userAuthenticationSubject.asObservable();

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
        //console.debug("AuthService::extractData|" + res);
        try {
            let body = res.json();
            return body;
        } catch (e) {
            console.error("AuthService::extractData|" + res);
            return {};
        }
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

    public successLogin(data: any): void {
        window.localStorage
            .setItem(
            'sessionId',
            data.sessionId);

        this.acceptAuthenticatedUser(data.sessionId, data.user, data.userRoles);
    }

    // public acceptAuthenticatedUser(sessionId: string, user: User): void;
    // public acceptAuthenticatedUser(sessionId: string, user: User, userRoles: Array<Role>): void;
    public acceptAuthenticatedUser(sessionId: string, user: User, userRoles: Array<Role>): void {
        this.isLoggedIn = true;
        this.sessionId = sessionId;
        this.authenticatedUser = user;
        this.authenticatedRoles = userRoles;
        this.userAuthenticationSubject.next(this.authenticatedUser);
    }

    logout(sessionId: string) {
        let headers = new Headers({
            'SessionId': this.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public successLogout(): void {
        window.localStorage.removeItem('sessionId');
        this.isLoggedIn = false;
        this.sessionId = null;
        this.authenticatedUser = null;
        this.userAuthenticationSubject.next(this.authenticatedUser);
    }

    /**
     * 
     */
    public check(sessionId: string, redirectUrl: string): Observable<boolean> {
        let headers = new Headers({
            'SessionId': sessionId
        });
        return this.http.get(encodeURI(this.baseUrl), { headers: headers })
            .map((data) => { return this.doMapCheck(redirectUrl, data) })
            .catch((res) => {
                return Observable.of(false);
            });
    }

    private doMapCheck(redirectUrl: string, response: any): boolean {
        let data = this.extractData(response);
        if (data.user) {
            if (!this.isLoggedIn)
                this.acceptAuthenticatedUser(data.sessionId, data.user, data.userRoles);
            console.info("AuthService::doMapCheck(" + JSON.stringify(data) + ")|true");
            return true;
        }

        // Store the attempted URL for redirecting
        this.redirectUrl = redirectUrl;

        console.warn("AuthService::doMapCheck(" + JSON.stringify(data) + ")|false");
        return false;
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
        //console.debug("AuthService::handleErrorResponse(" + JSON.stringify(response) + ")");
        let status = +response.status;
        if (status == 403) {
            // Forbidden
            // TODO : does not work well when the request was getting a ResponseType blob
            // maybe we should check for the type ? 
            //let error = response.json();
            //console.log("AuthService::handleError(status:" + status + ") error:" + JSON.stringify(error));
        } else if (status == 419) {
            // Authentication Timeout
            this.sessionId = null;
            this.authenticatedUser = null;
            location.reload();
        } else
        { console.warn("AuthService::handleErrorResponse(" + JSON.stringify(response) + ")|unknown status:" + status); }
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            let body;
            try {
                body = error.json();
            }
            catch (e) {
                body = '';
            }

            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error("AuthService::handleError|" + errMsg);
        return Observable.throw(errMsg + "(AuthService)");
    }
}
