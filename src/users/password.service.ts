//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';
import { AuthService } from '../auth/auth.service';
import { User } from './user';

@Injectable()
export class PasswordService {

    constructor(private http: Http, private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    tmpPassword(username: string): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(encodeURI(this.baseUrl + "/" + username), JSON.stringify({}), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    changePassword(user: User, currentPassword: string, newPassword: string): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + user.id), { cp: currentPassword, np: newPassword }, { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }



}