//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
//import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class JnlpService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) {
        if (typeof this.baseUrl === 'undefined') {
            console.warn('JnlpService.baseUrl using default');
            this.baseUrl = 'jnlp';
        }
    }

    run(id: string) {
        let headers = new HttpHeaders({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + id), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}