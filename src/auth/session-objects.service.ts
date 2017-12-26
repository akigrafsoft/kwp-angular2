//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { ServiceUtils } from '../services/service-utils';

@Injectable()
export class SessionObjectsService {

    constructor(private http: HttpClient,
        private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    public setSessionObject(key: string, object: any): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });

        return this.http.post(encodeURI(this.baseUrl),
            JSON.stringify({
                keyvalues: [
                    { 'key': key, value: object }
                ]
            }),
            { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    public getSessionObject(key: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });

        return this.http.put(encodeURI(this.baseUrl),
            JSON.stringify({
                'keys': [key]
            }),
            { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    public getSessionObjects(keys: Array<string>): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl),
            JSON.stringify({
                'keys': keys
            }),
            { headers: headers })
            .catch((response: HttpErrorResponse) => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }
}