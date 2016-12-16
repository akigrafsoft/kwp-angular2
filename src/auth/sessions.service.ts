//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';

@Injectable()
export class SessionsService {

    constructor(private http: Http, private authService: AuthService, private baseUrl: string) { }

    private extractData(res: Response): any {
        //console.debug("SessionsService::extractData|" + res);
        try {
            let body = res.json();
            return body;
        } catch (e) {
            console.error("SessionsService::extractData|" + res);
            return {};
        }
    }

    public getSessions(): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.get(this.baseUrl, { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getSession(sessionId: string): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getSessionObject(key: string): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/session/' + key), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
    }

    public destroySession(sessionId: string): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), { headers: headers })
            .map(this.extractData)
            .catch(this.handleError);
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
        console.error("SessionsService::handleError|" + errMsg);
        return Observable.throw(errMsg + "(SessionsService)");
    }
}