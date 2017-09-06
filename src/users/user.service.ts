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
export class UserService {

    constructor(private http: Http, private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    create(user: User): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(encodeURI(this.baseUrl), JSON.stringify(user), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getUser(userIdOrName: string): Observable<any | Error> {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + userIdOrName), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    update(user: User): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + user.id), JSON.stringify(user), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    del(id: string): Observable<any | Error> {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }
}