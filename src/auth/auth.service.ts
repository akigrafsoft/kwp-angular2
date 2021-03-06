//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ServiceUtils } from '../services/service-utils';
import { User } from '../users/users.module';
import { Role } from './role';

@Injectable()
export class AuthService {

    public static KEY_SESSION_ID = 'kwp-sessionId';

    public isLoggedIn = false;

    private _sessionId: string;

    public get sessionId(): string {
        if ( typeof this._sessionId !== 'undefined' && this._sessionId !== null ) {
            return this._sessionId;
        }
        this._sessionId = window.localStorage.getItem( AuthService.KEY_SESSION_ID );
        if ( this._sessionId !== null ) {
            return this._sessionId;
        }
        return '';
    }
    public authenticatedUser: User = null;
    public authenticatedRoles: Array<Role>;

    // All existing role names...
    roles: Array<string>;

    // Store the URL so we can redirect after logging in
    redirectUrl: string = null;

    private userAuthenticationSubject = new Subject<User>();
    private userAuthentication$ = this.userAuthenticationSubject.asObservable();

    private sessionTimedOutSubject = new Subject<User>();
    private sessionTimedOut$ = this.sessionTimedOutSubject.asObservable();

    constructor( private http: HttpClient, @Inject( 'baseUrl' ) private baseUrl: string ) { }

    public getAuthenticatedUser(): User {
        return this.authenticatedUser;
    }

    public getAuthenticatedRoles(): Array<Role> {
        return this.authenticatedRoles;
    }

    public getAllRolesNames(): Array<string> {
        return this.roles;
    }

    public setRedirectUrl( redirectUrl: string ) {
        this.redirectUrl = redirectUrl;
    }

    public getRedirectUrl(): string {
        return this.redirectUrl;
    }

    public observeUserAuthentication(): Observable<User> {
        return this.userAuthentication$;
    }

    public observeSessionTimedOut(): Observable<User> {
        return this.sessionTimedOut$;
    }

    public login( credentials: any ): Observable<any> {
        let headers = new HttpHeaders( {
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.sessionId
        } );
        return this.http.post( this.baseUrl, JSON.stringify( credentials ), { headers: headers } )
            .pipe(
            tap( data => this.doTapLogin( data ) ),
            catchError( ServiceUtils.handleError6( 'login', [] ) ) );
    }

    private doTapLogin( data: any ) {
        //console.log( 'doTapLogin(' + JSON.stringify( data ) + ')' );
        this.setSessionId( data.sessionId );
    }

    public setSessionId( sessionId: string ) {
        this._sessionId = sessionId;
        window.localStorage
            .setItem(
            AuthService.KEY_SESSION_ID,
            sessionId );
    }

    // public acceptAuthenticatedUser(sessionId: string, user: User): void;
    // public acceptAuthenticatedUser(sessionId: string, user: User, userRoles: Array<Role>): void;
    public setAuthenticatedUser( user: User, userRoles: Array<Role> ): void {
        this.isLoggedIn = true;
        this.authenticatedUser = user;
        this.authenticatedRoles = userRoles;
        this.userAuthenticationSubject.next( this.authenticatedUser );
    }

    public updateUser( user: User ): void {
        this.authenticatedUser = user;
        this.userAuthenticationSubject.next( this.authenticatedUser );
    }

    public logout( sessionId: string ): Observable<any> {
        let headers = new HttpHeaders( {
            'SessionId': this.sessionId
        } );
        return this.http.delete( encodeURI( this.baseUrl + '/' + sessionId ), { headers: headers } )
            .pipe( catchError( ServiceUtils.handleError6( 'logout', [] ) ) );
    }

    private cleanUp() {
        window.localStorage.removeItem( AuthService.KEY_SESSION_ID );
        this.isLoggedIn = false;
        this._sessionId = null;
        this.authenticatedUser = null;
        this.userAuthenticationSubject.next( this.authenticatedUser );
    }

    public successLogout(): void {
        this.cleanUp();
    }

    public check( sessionId: string, redirectUrl: string ): Observable<boolean | any> {
        let headers = new HttpHeaders( {
            'SessionId': sessionId
        } );
        return this.http.get( encodeURI( this.baseUrl + '/' + sessionId ), { headers: headers } )
            .pipe(
            map(( data ) => { return this.doMapCheck( redirectUrl, data ) } ),
            catchError( err => { this.handleErrorResponse( err ); return throwError( err ); } ),
            catchError( ServiceUtils.handleError6( 'check', [] ) ) );
    }

    private doMapCheck( redirectUrl: string, response: any ): boolean {
        if ( response.user ) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.redirectUrl = redirectUrl;

        console.warn( 'AuthService::doMapCheck(' + JSON.stringify( response ) + ')|false' );
        return false;
    }

    public isAuthenticated( userId: string ): boolean {
        return ( this.authenticatedUser && this.authenticatedUser.id === userId );
    }

    public isAllowed( i_right: string ): boolean {
        if ( !this.authenticatedUser ) {
            return false;
        }
        if ( !this.authenticatedRoles ) {
            return false;
        }

        if ( this.hasRole( 'ROOT' ) ) {
            return true;
        }

        for ( const role of this.authenticatedRoles ) {
            for ( const right of role.frontendRights ) {
                if ( i_right === right ) {
                    return true;
                }
            }
        }
        return false;
    }

    public hasRole( i_role: string ): boolean {
        if ( !this.authenticatedUser ) {
            return false;
        }
        if ( !this.authenticatedRoles ) {
            return false;
        }

        for ( const role of this.authenticatedRoles ) {
            if ( i_role === role.name ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Takes the promise response Object (do not provide it as json !)
     */
    public handleErrorResponse( response: HttpErrorResponse ) {
        let status = +response.status;
        if ( status === 403 ) {
            // Forbidden
            // TODO : does not work well when the request was getting a ResponseType blob
            // maybe we should check for the type ?
        } else if ( status === 419 ) {
            // Authentication Timeout
            const user: User = this.authenticatedUser;
            this.cleanUp();
            this.sessionTimedOutSubject.next( user );
        } else {
            console.warn( 'AuthService::handleErrorResponse(' + JSON.stringify( response ) + ')|unknown status:' + status );
        }
    }

}
