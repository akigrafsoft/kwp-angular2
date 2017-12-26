//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';
import { AuthService } from '../auth/auth.service';
import { User } from './user';

@Injectable()
export class UserService {

    constructor(private http: HttpClient,
        private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    create(user: User): Observable<any | Error> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(encodeURI(this.baseUrl), JSON.stringify(user), { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getUser(userIdOrName: string): Observable<any | Error> {
        let headers = new HttpHeaders({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + userIdOrName), { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    update(user: User): Observable<any | Error> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + user.id), JSON.stringify(user), { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    del(id: string): Observable<any | Error> {
        let headers = new HttpHeaders({
            'SessionId': this.authService.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + id), { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }
}