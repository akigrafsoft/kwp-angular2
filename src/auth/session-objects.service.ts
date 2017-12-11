//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
//import { Headers, Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { ServiceUtils } from '../services/service-utils';

@Injectable()
export class SessionObjectsService {

    constructor(private http: HttpClient, private authService: AuthService, @Inject("baseUrl") private baseUrl: string) { }

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
            //.map(ServiceUtils.extractData)
            .catch(response => {
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
            //.map(ServiceUtils.extractData)
            .catch(response => {
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
            //.map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    //    private handleError(error: Response | any): Observable<Response> | Observable<any> {
    //        // In a real world app, we might use a remote logging infrastructure
    //        let errMsg: string;
    //        if (error instanceof Response) {
    //            let body:any;
    //            try {
    //                body = error.json();
    //            }
    //            catch (e) {
    //                body = '';
    //            }
    //
    //            const err = body.error || JSON.stringify(body);
    //            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //        } else {
    //            errMsg = error.message ? error.message : error.toString();
    //        }
    //        console.error("SessionObjectsService::handleError|" + errMsg);
    //        return Observable.throw(errMsg + "(SessionObjectsService)");
    //    }
}